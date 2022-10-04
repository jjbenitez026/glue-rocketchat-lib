import { RcBaseResponse } from './response';
import { Message } from '../rc-events/message';

export interface LoadHistoryResponse extends RcBaseResponse {
    result: {
        messages: Array<Message>
    };
}
