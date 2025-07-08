// src/iam/model/sign-in.response.js

export class SignInResponse {
    constructor(id = 0, username = '', token = '') {
        this.id = id
        this.username = username
        this.token = token
    }

    static fromApiResponse(data) {
        return new SignInResponse(
            data.id,
            data.username,
            data.token
        )
    }

    get user() {
        return {
            id: this.id,
            username: this.username
        }
    }

    isValid() {
        return this.id > 0 && this.username && this.token
    }
}