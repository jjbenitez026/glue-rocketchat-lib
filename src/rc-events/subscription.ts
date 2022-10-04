import { Payload } from './payload';

export class Subscription<T> extends Payload<T> {
    constructor(
        public name: string,
        public id: string,
        public params: T,
    ) {
        super(
            'sub',
            id,
            params
        );
    }
}
