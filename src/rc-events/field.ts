import { Message } from './message';

export class Field {
    constructor(
        public eventName: String,
        public args: Message[]
    ) {
    }
}
