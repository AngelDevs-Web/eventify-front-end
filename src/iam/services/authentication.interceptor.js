// src/iam/services/authentication.interceptor.js

import { useAuthenticationStore } from './authentication.store.js'

export function setupAuthenticationInterceptor(axiosInstance) {
    // Request interceptor
    axiosInstance.interceptors.request.use(
        (config) => {
            const authStore = useAuthenticationStore()

            if (authStore.token) {
                config.headers.Authorization = `Bearer ${authStore.token}`
            }

            return config
        },
        (error) => {
            return Promise.reject(error)
        }
    )

    // Response interceptor
    axiosInstance.interceptors.response.use(
        (response) => response,
        (error) => {
            const authStore = useAuthenticationStore()

            if (error.response?.status === 401) {
                authStore.signOut()
                window.location.href = '/iam/sign-in'
            }

            return Promise.reject(error)
        }
    )
}