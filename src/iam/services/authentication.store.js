import {AuthenticationService} from "./authentication.service.js";
import {defineStore} from "pinia";
import {SignInResponse} from "../model/sign-in.response.js";
import {SignUpResponse} from "../model/sign-up.response.js";

const authenticationService = new AuthenticationService();

/**
 * Store definition for authentication
 * @summary
 * This store is responsible to manage the authentication state.
 * It contains state for signed-in status, user ID, and username.
 * It contains actions to sign-in, sign-up, and sign-out.
 */
export const useAuthenticationStore = defineStore('authentication',{
    state: () => ({ signedIn: false, userId: 0, username: '' }),
    getters: {
        /**
         * Getter to check if user is signed in
         * @param state - Current state of the store
         * @returns {boolean} - True if user is signed in, false otherwise
         */
        isSignedIn: (state) => state['signedIn'],
        /**
         * Getter to get the current user ID
         * @param state - Current state of the store
         * @returns {number} - Current user ID
         */
        currentUserId: (state) => state['userId'],
        /**
         * Getter to get the current username
         * @param state - Current state of the store
         * @returns {string} - Current username
         */
        currentUsername: (state) => state['username'],
        /**
         * Getter to get the current token
         * @returns {string} - Current token
         */
        currentToken: () => localStorage.getItem('token')
    },
    actions: {
        /**
         * Action to sign-in
         * @summary
         * This action calls the sign-in API and updates the store state.
         * If sign-in is successful, it sets the signed-in status, user ID, and username.
         * It also saves the token in local storage.
         * If sign-in fails, it redirects to the sign-in page.
         * @param signInRequest - The {@link SignInRequest} object to sign-in
         * @param router - Vue router instance
         */
        async signIn(signInRequest, router) {
            authenticationService.signIn(signInRequest)
                .then(response => {
                    let signInResponse = new SignInResponse(response.data.id, response.data.username, response.data.token);
                    this.signedIn = true;
                    this.userId = signInResponse.id;
                    this.username = signInResponse.username;
                    localStorage.setItem('token', signInResponse.token);
                    console.log(signInResponse);
                    router.push({ name: 'Home' });
                })
                .catch(error => {
                    console.log(error);
                    router.push({ name: 'sign-in' });
                });
        },
        async signUp(signUpdRequest, router) {
            /**
             * Action to sign-up
             * @summary
             * This action calls the sign-up API.
             * If sign-up is successful, it redirects to the sign-in page.
             * If sign-up fails, it redirects to the sign-up page.
             * @param signUpdRequest - The {@link SignUpRequest} object to sign-up
             * @param router - Vue router instance
             */
            authenticationService.signUp(signUpdRequest)
                .then(response => {
                    let signUpResponse = new SignUpResponse(response.data.message);
                    router.push({ name: 'sign-in' });
                    console.log(signUpResponse);
                })
                .catch(error => {
                    console.log(error);
                    router.push({ name: 'sign-up' });
                });
        },
        /**
         * Action to sign-out
         * @summary
         * This action signs out the user.
         * It sets the signed-in status to false, user ID to 0, and username to empty string.
         * It also removes the token from local storage.
         * It redirects to the sign-in page.
         * @param router - Vue router instance
         */
        async signOut(router) {
            this.signedIn = false;
            this.userId = 0;
            this.username = '';
            localStorage.removeItem('token');
            console.log('Signed out');
            router.push({ name: 'sign-in' });
        }
    }
});