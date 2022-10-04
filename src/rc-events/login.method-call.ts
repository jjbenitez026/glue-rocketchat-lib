import { MethodCall } from './method-call';

export class UserAndPassLoginMethodCall extends MethodCall {
    constructor(
        public id: string,
        public username: string,
        public usernameType: string,
        public passwordAsSha256: string,
    ) {
        super(
            id,
            'login',
            [{
                user: {[usernameType]: username},
                password: {
                    digest: passwordAsSha256,
                    algorithm: 'sha-256'
                }
            }]
        );
    }
}
