import { Email } from './email';

export interface UserInfo {
    _id: string;
    name: string;
    emails: Array<Email>;
    status: string;
    statusConnection: string;
    username: string;
    utcOffset: number;
    active: boolean;
    roles: Array<string>;
    settings?: {
        preferences: {}
    };
    avatarUrl?: string;
    customFields?: {};
}
