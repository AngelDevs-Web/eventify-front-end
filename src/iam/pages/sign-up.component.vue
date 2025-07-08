<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-950 via-blue-900 to-purple-900 flex items-center justify-center p-4">
    <div class="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 w-full max-w-md border border-white/20">
      <div class="text-center mb-8">
        <div class="mx-auto w-16 h-16 bg-gradient-to-br from-purple-400 to-blue-500 rounded-2xl flex items-center justify-center mb-4">
          <i class="pi pi-user-plus text-white text-2xl"></i>
        </div>
        <h1 class="text-3xl font-bold text-white mb-2">Create Account</h1>
        <p class="text-purple-200">Join Eventify Platform</p>
      </div>

      <div v-if="authStore.hasError" class="bg-red-500/20 border border-red-400/50 text-red-200 px-4 py-3 rounded-lg mb-6">
        {{ authStore.error }}
      </div>

      <div v-if="validationErrors.length > 0" class="bg-red-500/20 border border-red-400/50 text-red-200 px-4 py-3 rounded-lg mb-6">
        <ul class="list-disc list-inside">
          <li v-for="error in validationErrors" :key="error">{{ error }}</li>
        </ul>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-purple-200 mb-2">Username</label>
          <div class="relative">
            <i class="pi pi-user absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-300"></i>
            <input
                v-model="formData.username"
                type="text"
                class="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 text-white placeholder-purple-300"
                placeholder="Choose a username"
                required
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-purple-200 mb-2">Password</label>
          <div class="relative">
            <i class="pi pi-lock absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-300"></i>
            <input
                v-model="formData.password"
                :type="showPassword ? 'text' : 'password'"
                class="w-full pl-12 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 text-white placeholder-purple-300"
                placeholder="Create a secure password"
                required
            />
            <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-300 hover:text-white"
            >
              <i :class="showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
            </button>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-purple-200 mb-2">Confirm Password</label>
          <div class="relative">
            <i class="pi pi-lock absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-300"></i>
            <input
                v-model="formData.confirmPassword"
                :type="showPassword ? 'text' : 'password'"
                class="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 text-white placeholder-purple-300"
                placeholder="Confirm your password"
                required
            />
          </div>
        </div>

        <button
            type="submit"
            :disabled="authStore.loading"
            class="w-full bg-gradient-to-r from-purple-500 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:transform-none"
        >
          {{ authStore.loading ? 'Creating account...' : 'Create Account' }}
        </button>
      </form>

      <div class="mt-6 text-center">
        <p class="text-purple-200">Already have an account?</p>
        <router-link
            to="/iam/sign-in"
            class="text-purple-400 hover:text-purple-300 font-semibold mt-2 inline-block"
        >
          Sign in
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthenticationStore } from '../services/authentication.store.js'

// Composables
const router = useRouter()
const authStore = useAuthenticationStore()

// State
const showPassword = ref(false)
const formData = reactive({
  username: '',
  password: '',
  confirmPassword: ''
})

// Computed
const validationErrors = computed(() => {
  const errors = []

  if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
    errors.push('Passwords do not match')
  }

  return errors
})

// Methods
const handleSubmit = async () => {
  authStore.clearError()

  // Client-side validation
  if (validationErrors.value.length > 0) {
    return
  }

  try {
    const response = await authStore.signUp(formData.username, formData.password)

    // Reset form
    formData.username = ''
    formData.password = ''
    formData.confirmPassword = ''

    // Show success message and redirect to sign in
    const message = response.message || 'User created successfully. Please sign in.'
    alert(message)
    router.push('/iam/sign-in')
  } catch (error) {
    // Error is already handled by the store and displayed in the template
    console.error('Sign up failed:', error.message)
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