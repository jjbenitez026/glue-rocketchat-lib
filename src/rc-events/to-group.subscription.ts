import { Subscription } from './subscription';

export class ToGroupSubscription extends Subscription<Array<string|boolean>>{
    constructor(
        public id: string,
        public params: Array<string|boolean>
    ) {
        super(
            'stream-room-messages',
            id,
            params
        );
    }
}
