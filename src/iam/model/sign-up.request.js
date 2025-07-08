// src/iam/model/sign-up.request.js

export class SignUpRequest {
    constructor(username = '', password = '') {
        this.username = username
        this.password = password
    }

    static fromForm(formData) {
        return new SignUpRequest(
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

        if (this.username.length < 3) {
            errors.push('Username must be at least 3 characters')
        }

        if (!this.password || this.password.trim() === '') {
            errors.push('Password is required')
        }

        if (this.password.length < 6) {
            errors.push('Password must be at least 6 characters')
        }

        return {
            isValid: errors.length === 0,
            errors
        }
    }
}