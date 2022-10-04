import { BaseResponse } from './base-response';
import { UserInfo } from '../api-models/user-info';

export interface MeResponse extends BaseResponse, UserInfo {
}
