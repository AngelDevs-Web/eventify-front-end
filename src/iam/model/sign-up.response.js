// src/iam/model/sign-up.response.js

export class SignUpResponse {
    constructor(message = '', success = false) {
        this.message = message
        this.success = success
    }

    static fromApiResponse(data) {
        return new SignUpResponse(
            data.message || 'User created successfully',
            true
        )
    }

    static fromError(error) {
        return new SignUpResponse(
            error.message || 'Registration failed',
            false
        )
    }

    isSuccess() {
        return this.success
    }

    toString() {
        return this.message
    }
}