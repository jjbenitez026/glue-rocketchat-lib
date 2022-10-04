import { MethodCall } from './method-call';

export class SendPlainMessageMethodCall extends MethodCall {
    constructor(
        public id: string,
        public params: [{
            _id: string,
            rid: string,
            msg: string
        }]
    ) {
        super(
            id,
            'sendMessage',
            params
        );
    }
}
