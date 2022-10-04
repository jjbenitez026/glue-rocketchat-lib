import { Time } from './time';
import { Mention } from './mention';
import { User } from './user';

export class Message {
    constructor(
        public _id?: string,
        public _rid?: string,
        public msg?: string,
        public tmid?: string,
        public ts?: Time,
        public mentions?: Array<Mention>,
        public u?: User,
        public blocks?: any,
        public md?: any,
        public starred?: Array<string>,
        public pinned?: boolean,
        public unread?: boolean,
        public temp?: boolean,
        public local?: boolean,
        public drid?: string|null,
        public _updatedAt?: Time,
        public editedAt?: any,
        public editedBy?: any,
        public urls?: any,
        public attachments?: any,
        public alias?: any,
        public avatar?: any,
        public groupable?: any,
        public channel?: any,
        public parseUrls?: any,
        public tlm?: any,
        public reactions?: any,
    ) {
    }
}
