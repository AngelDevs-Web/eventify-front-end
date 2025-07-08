/**
 * Sign up request model
 * @summary
 * Represents a sign-up request. This is used to register a user.
 */
export class SignUpRequest {
    /**
     * Constructor
     * @param {string} username The username of the user.
     * @param {string} password The password of the user.
     */
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }
}