import { MeResponse } from './api-response/me.response';

export class RcApi {
    constructor(
        public url: string,
        public userId?: string,
        public token?: string
    ) {
    }

    async me(): Promise<MeResponse> {
        const r = await fetch(`${this.url}/me`, {
            headers: this.authHeaders()
        });

        return r.json();
    }

    authHeaders() {
        const headers = {} as any;

        if (this.token) {
            headers['X-Auth-Token'] = this.token;
        }

        if (this.userId) {
            headers['X-User-Id'] = this.userId;
        }

        return headers;
    }
}
