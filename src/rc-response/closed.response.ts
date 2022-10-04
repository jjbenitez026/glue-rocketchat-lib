import { RcBaseResponse } from './response';
import { MsgType } from '../types/msg.type';

export class ClosedResponse implements RcBaseResponse {
    constructor(
        public id: string,
        public msg: MsgType = 'closed'
    ) {
    }
}
