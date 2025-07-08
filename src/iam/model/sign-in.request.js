// src/iam/model/sign-in.request.js

export class SignInRequest {
    constructor(username = '', password = '') {
        this.username = username
        this.password = password
    }

    static fromForm(formData) {
        return new SignInRequest(
            formData.username,
            formData.password
        )
    }

    toJSON() {
        return {
            username: this.username,
            password: this.password
        }
    }

    validate() {
        const errors = []

        if (!this.username || this.username.trim() === '') {
            errors.push('Username is required')
        }

        if (!this.password || this.password.trim() === '') {
            errors.push('Password is required')
        }

        return {
            isValid: errors.length === 0,
            errors
        }
    }
}