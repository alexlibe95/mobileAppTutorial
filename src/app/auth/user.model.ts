export class User {
    constructor(
        public id: string,
        public email: string,
        private token: string,
        private tokenExpirationDate: Date
    ) {}

    get Token() {
        if (!this.tokenExpirationDate || this.tokenExpirationDate <= new Date()) {
            return null;
        }
        return this.token;
    }

    get tokenDuration() {
        if (!this.token) {
            return 0;
        }
        return this.tokenExpirationDate.getTime() - new Date().getTime();
    }
}
