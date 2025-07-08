/**
 * Sign Up Response
 * @summary
 * Represents a sign-up response. This is used to transfer the result of a sign-up operation.
 */
export class SignUpResponse {
    /**
     * Constructor
     * @param {string} message The message to be returned.
     */
    constructor(message) {
        this.message = message;
    }
}