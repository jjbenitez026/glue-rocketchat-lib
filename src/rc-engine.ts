import { RealTimeAPI } from 'rocket.chat.realtime.api.rxjs';
import { debounceTime, filter, mergeMap, take, tap } from 'rxjs/operators';
import { Subject, Subscription as RxjsSubscription } from 'rxjs';
import { v4 as uuid } from 'uuid';

import { ToGroupSubscription } from './rc-events/to-group.subscription';
import { LoadHistoryMethodCall } from './rc-events/load-history.method-call';
import { Time } from './rc-events/time';
import { RcBaseResponse } from './rc-response/response';
import { ToGroupSubscriptionResponse } from './rc-response/to-group-subscription.response';
import { LoadHistoryResponse } from './rc-response/load-history.response';
import { RoomMessageResponse } from './rc-response/room-message.response';
import { SendPlainMessageMethodCall } from './rc-events/send-plain-message.method-call';
import { SendPlainMessageResponse } from './rc-response/send-plain-message.response';
import { UserAndPassLoginMethodCall } from './rc-events/login.method-call';
import { LoginResponse } from './rc-response/login.response';
import { ClosedResponse } from './rc-response/closed.response';

export class RcEngine {
    private api!: RealTimeAPI;
    private apiSub!: RxjsSubscription;
    private keepAliveSub!: RxjsSubscription;
    private bus$$ = new Subject<RcBaseResponse>();
    public session!: string;

    public bus$ = this.bus$$.asObservable();

    constructor(
        private url: string
    ) {
    }

    open() {
        if (!this.api) {
            this.api = new RealTimeAPI(this.url);

            this.keepAliveSub = this.api.connectToServer()
                .pipe(
                    mergeMap(() => this.api.keepAlive()),
                )
                .subscribe()
            ;

            this.apiSub = this.api.getObservable()
                .pipe(
                    tap(e => this.bus$$.next(e)),
                    filter(e => e.msg === 'ping'),
                    debounceTime(45000),
                    tap(() => this.bus$$.next(new ClosedResponse('id')))
                )
                .subscribe(
                    (data) => {
                        if (data.msg === 'connected') {
                            this.session = data.session;
                        }
                    },
                    (err) => console.log(err),
                    () => console.log('completed')
                );
        }

    }

    async login(username: string, password: string, id?: string): Promise<LoginResponse> {
        const _id = id ?? uuid();
        let usernameType = username.indexOf("@") !== -1 ? "email" : "username";

        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hash = await crypto.subtle.digest('SHA-256', data);

        const hashArray = Array.from(new Uint8Array(hash));
        const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

        const loginRequest = new UserAndPassLoginMethodCall(
            _id,
            username,
            usernameType,
            hashHex
        );

        const promise = this.bus$
            .pipe(
                filter(r => r.msg === 'result' && r.id === _id),
                take(1)
            )
            .toPromise() as Promise<LoginResponse>;

        this.api.sendMessage(loginRequest);

        return promise;
    }

    subscribeToGroup(groupId: string, id?: string): Promise<ToGroupSubscriptionResponse> {
        const _id = id ?? uuid();

        const subRequest = new ToGroupSubscription(
            _id,
            [groupId, false]
        )

        const promise = this.bus$
            .pipe(
                filter(r => r.msg === 'ready' && (r as ToGroupSubscriptionResponse).subs.includes(_id)),
                take(1)
            )
            .toPromise() as Promise<ToGroupSubscriptionResponse>;

        this.api.sendMessage(subRequest);

        return promise;
    }

    sendPlainMessage(msg: string, groupId: string, id?: string): Promise<SendPlainMessageResponse> {
        const _id = id ?? uuid();

        const sendMessageRequest = new SendPlainMessageMethodCall(
            _id,
            [{ _id, rid: groupId, msg }]
        )

        const promise = this.bus$
            .pipe(
                filter(r => r.msg === 'result' && (r as SendPlainMessageResponse).id === _id),
                take(1)
            )
            .toPromise() as Promise<SendPlainMessageResponse>;

        this.api.sendMessage(sendMessageRequest);

        return promise;
    }

    /**
     * Use this method to make the initial load of a room.
     * After the initial load you may subscribe to the room messages stream
     * https://developer.rocket.chat/reference/api/realtime-api/method-calls/load-history
     *
     * @param groupId
     * @param before The NEWEST message timestamp date (or null) to only retrieve messages before this time. - this is used to do pagination (A partir de donde empezar a leer los mensajes, como un offset)
     * @param from A date object - the date of the last time the client got data for the room (Punto de inicio de la carga, me subscribo y aqui paso la fecha del primer mensaje de la subscripcion, o de cuando se completó esta)
     * @param size
     * @param id
     */
    loadGroupHistory(groupId: string,
                     before: number | null,
                     from: number | null,
                     size = 50,
                     id?: string): Promise<LoadHistoryResponse> {
        const _id = id ?? uuid();

        const _before = before ? new Time(before) : null;
        const _from = from ? new Time(from) : null;

        const promise = this.bus$
            .pipe(
                filter(r => r.id === _id),
                take(1)
            )
            .toPromise() as Promise<LoadHistoryResponse>;

        const subRequest = new LoadHistoryMethodCall(
            _id,
            [groupId, _before, size, _from]
        )

        this.api.sendMessage(subRequest);

        return promise;
    }

    isGroupMessage(msg: RcBaseResponse, groupId: string) {
        return msg.msg === 'changed' &&
            (msg as RoomMessageResponse)?.collection === 'stream-room-messages' &&
            (msg as RoomMessageResponse)?.fields?.eventName === groupId
            ;
    }

    close() {
        if (this.api) {
            this.api.disconnect();
        }

        if (this.apiSub) {
            this.apiSub.unsubscribe();
        }

        if (this.keepAliveSub) {
            this.keepAliveSub.unsubscribe();
        }
    }
}
