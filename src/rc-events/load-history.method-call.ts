import { MethodCall } from './method-call';
import { Time } from './time';

export class LoadHistoryMethodCall extends MethodCall {
    constructor(
        public id: string,
        public params: [string, (Time|null), number, (Time|null)]
    ) {
        super(
            id,
            'loadHistory',
            params
        );
    }
}
