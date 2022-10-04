export class Payload<T> {
    constructor(
        public msg: string,
        public id: string|undefined,
        public params: T
    ) {
    }
}
