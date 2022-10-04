import { MsgType } from '../types/msg.type';

export interface RcResponse {
}

export interface RcBaseResponse extends RcResponse {
    id: string,
    msg: MsgType,
}
