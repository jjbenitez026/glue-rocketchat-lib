import { Payload } from './payload';

export class PingPayload extends Payload<void> {
    constructor(
        public id: string|undefined
    ) {
        super(
            "ping",
            id
        );
    }
}
