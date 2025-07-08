<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-950 via-purple-900 to-blue-900 flex items-center justify-center p-4">
    <div class="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 w-full max-w-md border border-white/20">
      <div class="text-center mb-8">
        <div class="mx-auto w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center mb-4">
          <i class="pi pi-shield text-white text-2xl"></i>
        </div>
        <h1 class="text-3xl font-bold text-white mb-2">Sign In</h1>
        <p class="text-blue-200">Access your Eventify account</p>
      </div>

      <div v-if="authStore.hasError" class="bg-red-500/20 border border-red-400/50 text-red-200 px-4 py-3 rounded-lg mb-6">
        {{ authStore.error }}
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-blue-200 mb-2">Username</label>
          <div class="relative">
            <i class="pi pi-user absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300"></i>
            <input
                v-model="formData.username"
                type="text"
                class="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-white placeholder-blue-300"
                placeholder="Enter your username"
                required
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-blue-200 mb-2">Password</label>
          <div class="relative">
            <i class="pi pi-lock absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300"></i>
            <input
                v-model="formData.password"
                :type="showPassword ? 'text' : 'password'"
                class="w-full pl-12 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-white placeholder-blue-300"
                placeholder="Enter your password"
                required
            />
            <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-300 hover:text-white"
            >
              <i :class="showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
            </button>
          </div>
        </div>

        <button
            type="submit"
            :disabled="authStore.loading"
            class="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:transform-none"
        >
          {{ authStore.loading ? 'Signing in...' : 'Sign In' }}
        </button>
      </form>

      <div class="mt-6 text-center">
        <p class="text-blue-200">Don't have an account?</p>
        <router-link
            to="/iam/sign-up"
            class="text-blue-400 hover:text-blue-300 font-semibold mt-2 inline-block"
        >
          Create new account
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthenticationStore } from '../services/authentication.store.js'

// Composables
const router = useRouter()
const authStore = useAuthenticationStore()

// State
const showPassword = ref(false)
const formData = reactive({
  username: '',
  password: ''
})

// Methods
const handleSubmit = async () => {
  authStore.clearError()

  try {
    await authStore.signIn(formData.username, formData.password)

    // Redirect to dashboard on success
    router.push('/home')
  } catch (error) {
    // Error is handled by the store
    console.error('Sign in failed:', error)
  }
}

// Lifecycle
onMounted(() => {
  // Clear any previous errors
  authStore.clearError()

  // If already authenticated, redirect to home
  if (authStore.isLoggedIn) {
    router.push('/home')
  }
})
</script>