import { RcBaseResponse } from './response';

export interface ToGroupSubscriptionResponse extends RcBaseResponse {
    subs: Array<string>;
}
