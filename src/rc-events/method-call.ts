import { Payload } from './payload';

export class MethodCall extends Payload<any>{
    constructor(
        public id: string,
        public method: string,
        public params: any,
    ) {
        super(
            "method",
            id,
            params
        );
    }
}
