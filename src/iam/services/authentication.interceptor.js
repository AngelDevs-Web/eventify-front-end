import {useAuthenticationStore} from "./authentication.store.js";

/**
 * Interceptor to add authentication token to the request
 * @param config - Axios request configuration
 * @returns {AxiosRequestConfig} - Updated Axios request configuration
 */
export const authenticationInterceptor = (config) => {
    const authenticationStore = useAuthenticationStore();
    const isSignedIn = authenticationStore.isSignedIn;
    if (isSignedIn) {
        config.headers.Authorization = `Bearer ${authenticationStore.currentToken}`;
        console.log(config);
    }
    return config;
}