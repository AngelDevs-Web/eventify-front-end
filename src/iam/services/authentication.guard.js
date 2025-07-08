// src/iam/services/authentication.guard.js

import { useAuthenticationStore } from './authentication.store.js'

export function authenticationGuard(to, from, next) {
    const authStore = useAuthenticationStore()

    // Check if route requires authentication
    if (to.meta.requiresAuth && !authStore.isLoggedIn) {
        // Redirect to sign-in if not authenticated
        next({
            name: 'SignIn',
            query: { redirect: to.fullPath } // Save intended destination
        })
    }
    // Check if route is only for guests (login/register pages)
    else if (to.meta.requiresGuest && authStore.isLoggedIn) {
        // Redirect to home if already authenticated
        next({ name: 'Home' })
    }
    else {
        // Proceed normally
        next()
    }
}