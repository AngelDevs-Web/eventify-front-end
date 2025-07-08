// src/iam/services/authentication.store.js

import { defineStore } from 'pinia'
import { AuthenticationService } from './authentication.service.js'
import { SignInRequest } from '../model/sign-in.request.js'
import { SignUpRequest } from '../model/sign-up.request.js'

export const useAuthenticationStore = defineStore('authentication', {
    state: () => ({
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false,
        error: null
    }),

    getters: {
        isLoggedIn: (state) => state.isAuthenticated && !!state.token,
        currentUser: (state) => state.user,
        hasError: (state) => !!state.error
    },

    actions: {
        async signIn(username, password) {
            this.loading = true
            this.error = null

            try {
                const authService = new AuthenticationService()
                const request = new SignInRequest(username, password)

                // Validate request
                const validation = request.validate()
                if (!validation.isValid) {
                    throw new Error(validation.errors.join(', '))
                }

                const response = await authService.signIn(request)

                if (response.isValid()) {
                    this.isAuthenticated = true
                    this.user = response.user
                    this.token = response.token

                    // Store in localStorage
                    localStorage.setItem('eventify_token', response.token)
                    localStorage.setItem('eventify_user', JSON.stringify(response.user))

                    console.log('User signed in successfully:', response.user.username)
                    return response
                } else {
                    throw new Error('Invalid response from server')
                }
            } catch (error) {
                this.error = error.message
                console.error('Sign in failed:', error.message)
                throw error
            } finally {
                this.loading = false
            }
        },

        async signUp(username, password) {
            this.loading = true
            this.error = null

            try {
                const authService = new AuthenticationService()
                const request = new SignUpRequest(username, password)

                // Validate request
                const validation = request.validate()
                if (!validation.isValid) {
                    throw new Error(validation.errors.join(', '))
                }

                const response = await authService.signUp(request)
                console.log('User registered successfully')
                return response
            } catch (error) {
                this.error = error.message
                console.error('Sign up failed:', error.message)
                throw error
            } finally {
                this.loading = false
            }
        },

        signOut() {
            const authService = new AuthenticationService()
            authService.logout()

            this.isAuthenticated = false
            this.user = null
            this.token = null
            this.error = null

            console.log('User signed out')
        },

        initializeAuth() {
            try {
                const token = localStorage.getItem('eventify_token')
                const user = localStorage.getItem('eventify_user')

                if (token && user) {
                    this.isAuthenticated = true
                    this.user = JSON.parse(user)
                    this.token = token
                    console.log('Authentication restored from localStorage for user:', this.user.username)
                } else {
                    console.log('No previous authentication found')
                }
            } catch (error) {
                console.error('Error initializing auth:', error)
                this.signOut()
            }
        },

        clearError() {
            this.error = null
        }
    }
})