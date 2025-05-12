/**
 * @fileoverview HTTP client configuration using axios
 * @module httpInstance
 */

import axios from "axios";

/**
 * Configured axios instance for making HTTP requests
 * @const {import('axios').AxiosInstance}
 * @description Creates a pre-configured axios instance with base URL and default headers
 * @property {string} baseURL - The base URL for all requests from environment variable
 * @property {Object} headers - Default headers for all requests
 * @property {string} headers.Content-Type - Sets JSON as the default content type
 * @property {string} headers.Access-Control-Allow-Origin - CORS header to allow all origins
 */
const httpInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
});

export default httpInstance;