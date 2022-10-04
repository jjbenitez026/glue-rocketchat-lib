import { RcBaseResponse } from './response';
import { Message } from '../rc-events/message';

export interface SendPlainMessageResponse extends RcBaseResponse{
    result: Message
}
