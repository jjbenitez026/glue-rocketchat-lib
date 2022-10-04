export type MentionType = 'user' | 'team';

export class Mention {
    constructor(
        public name: string,
        public type: MentionType,
        public username: string,
        public _id: string,
    ) {
    }
}
