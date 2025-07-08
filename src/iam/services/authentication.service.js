// src/iam/services/authentication.service.js

import { SignInRequest } from '../model/sign-in.request.js'
import { SignInResponse } from '../model/sign-in.response.js'
import { SignUpRequest } from '../model/sign-up.request.js'
import { SignUpResponse } from '../model/sign-up.response.js'

export class AuthenticationService {
    constructor() {
        this.baseURL = import.meta.env.VITE_API_BASE_URL
    }

    async signIn(signInRequest) {
        try {
            console.log('Attempting sign in for user:', signInRequest.username)

            const response = await fetch(`${this.baseURL}/authentication/sign-in`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(signInRequest.toJSON())
            })

            console.log('Sign in response status:', response.status)

            if (!response.ok) {
                let errorMessage = 'Authentication failed'

                try {
                    // Clone the response to avoid "already read" error
                    const responseText = await response.clone().text()
                    console.log('Raw sign in error response:', responseText)

                    try {
                        const errorData = JSON.parse(responseText)
                        errorMessage = errorData.message || errorMessage
                    } catch (jsonError) {
                        // If it's not JSON, use the text as error message
                        errorMessage = responseText || errorMessage
                    }

                    // Handle specific error cases
                    if (response.status === 401) {
                        errorMessage = 'Invalid username or password'
                    } else if (response.status === 500) {
                        if (responseText.includes("doesn't exist")) {
                            errorMessage = 'Database error: Users table not found. Please contact administrator.'
                        } else {
                            errorMessage = 'Server error. Please try again later.'
                        }
                    }
                } catch (readError) {
                    console.error('Error reading response:', readError)
                    errorMessage = `Server error (${response.status})`
                }

                throw new Error(errorMessage)
            }

            const data = await response.json()
            console.log('Sign in successful for user:', data.username)
            return SignInResponse.fromApiResponse(data)
        } catch (error) {
            console.error('Sign in error:', error)
            throw error
        }
    }

    async signUp(signUpRequest) {
        try {
            console.log('Attempting sign up for user:', signUpRequest.username)

            const response = await fetch(`${this.baseURL}/authentication/sign-up`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(signUpRequest.toJSON())
            })

            console.log('Sign up response status:', response.status)

            if (!response.ok) {
                let errorMessage = 'Registration failed'

                try {
                    // Clone the response to avoid "already read" error
                    const responseText = await response.clone().text()
                    console.log('Raw sign up error response:', responseText)

                    try {
                        const errorData = JSON.parse(responseText)
                        errorMessage = errorData.message || errorMessage
                    } catch (jsonError) {
                        // If it's not JSON, use the text as error message
                        errorMessage = responseText || errorMessage
                    }

                    // Handle specific error cases
                    if (response.status === 400) {
                        errorMessage = 'Username already exists or invalid data'
                    } else if (response.status === 500) {
                        if (responseText.includes("doesn't exist")) {
                            errorMessage = 'Database error: Users table not found. Please contact administrator.'
                        } else {
                            errorMessage = 'Server error. Please check database connection.'
                        }
                    }
                } catch (readError) {
                    console.error('Error reading response:', readError)
                    errorMessage = `Server error (${response.status})`
                }

                throw new Error(errorMessage)
            }

            // Handle successful response
            let data
            const contentType = response.headers.get('content-type')

            if (contentType && contentType.includes('application/json')) {
                data = await response.json()
            } else {
                const textData = await response.text()
                data = { message: textData || 'User created successfully' }
            }

            console.log('Sign up successful')
            return SignUpResponse.fromApiResponse(data)
        } catch (error) {
            console.error('Sign up error:', error)
            throw error
        }
    }

    async getUsers() {
        try {
            const token = localStorage.getItem('eventify_token')

            if (!token) {
                throw new Error('No authentication token available')
            }

            const response = await fetch(`${this.baseURL}/users`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Authentication token expired')
                }
                throw new Error('Failed to fetch users')
            }

            return await response.json()
        } catch (error) {
            console.error('Get users error:', error)
            throw error
        }
    }

    logout() {
        console.log('Logging out user')
        localStorage.removeItem('eventify_token')
        localStorage.removeItem('eventify_user')
    }
}