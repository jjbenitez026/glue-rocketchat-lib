import { RcBaseResponse } from './response';
import { Time } from '../rc-events/time';

export interface LoginResponse extends RcBaseResponse {
    result: {
        id: string,
        token: string,
        tokenExpires: Time,
        type: string
    };
}
