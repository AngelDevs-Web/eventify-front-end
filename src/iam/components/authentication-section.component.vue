<template>
  <div class="authentication-section">
    <!-- Header Section -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-2xl font-bold text-white">{{ sectionTitle }}</h2>
        <p class="text-gray-300 mt-1">{{ sectionDescription }}</p>
      </div>
      <div class="flex items-center space-x-3">
        <div class="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
          <i class="pi pi-shield text-white"></i>
        </div>
        <div v-if="authStore.isLoggedIn" class="text-right">
          <p class="text-white font-medium">{{ authStore.currentUser?.username }}</p>
          <p class="text-gray-400 text-sm">Authenticated</p>
        </div>
      </div>
    </div>

    <!-- Authentication Status Card -->
    <div class="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 mb-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <div :class="[
            'w-12 h-12 rounded-lg flex items-center justify-center',
            authStore.isLoggedIn ? 'bg-green-500/20' : 'bg-red-500/20'
          ]">
            <i :class="authStore.isLoggedIn ? 'pi pi-check-circle text-green-400' : 'pi pi-times-circle text-red-400'"></i>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-white">
              {{ authStore.isLoggedIn ? 'Authenticated' : 'Not Authenticated' }}
            </h3>
            <p class="text-gray-300 text-sm">
              {{ authStore.isLoggedIn ? 'Active session' : 'Authentication required' }}
            </p>
          </div>
        </div>

        <div class="flex items-center space-x-3">
          <div v-if="authStore.isLoggedIn" class="text-right">
            <p class="text-sm text-gray-300">Last access</p>
            <p class="text-white font-medium">{{ lastAccessTime }}</p>
          </div>

          <button
              v-if="authStore.isLoggedIn"
              @click="handleSignOut"
              class="px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors flex items-center space-x-2"
          >
            <i class="pi pi-sign-out"></i>
            <span>Sign Out</span>
          </button>

          <router-link
              v-else
              to="/iam/sign-in"
              class="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors flex items-center space-x-2"
          >
            <i class="pi pi-sign-in"></i>
            <span>Sign In</span>
          </router-link>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div v-if="showQuickActions" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      <button
          @click="navigateToSignIn"
          class="p-4 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors text-left"
          :disabled="authStore.isLoggedIn"
      >
        <div class="flex items-center space-x-3">
          <i class="pi pi-sign-in text-blue-400 text-2xl"></i>
          <div>
            <h4 class="text-white font-medium">Sign In</h4>
            <p class="text-gray-400 text-sm">Access your account</p>
          </div>
        </div>
      </button>

      <button
          @click="navigateToSignUp"
          class="p-4 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors text-left"
          :disabled="authStore.isLoggedIn"
      >
        <div class="flex items-center space-x-3">
          <i class="pi pi-user-plus text-purple-400 text-2xl"></i>
          <div>
            <h4 class="text-white font-medium">Create Account</h4>
            <p class="text-gray-400 text-sm">Register on the platform</p>
          </div>
        </div>
      </button>

      <button
          @click="refreshToken"
          class="p-4 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors text-left"
          :disabled="!authStore.isLoggedIn"
      >
        <div class="flex items-center space-x-3">
          <i class="pi pi-refresh text-green-400 text-2xl"></i>
          <div>
            <h4 class="text-white font-medium">Refresh Session</h4>
            <p class="text-gray-400 text-sm">Update access token</p>
          </div>
        </div>
      </button>
    </div>

    <!-- Session Information -->
    <div v-if="authStore.isLoggedIn && showSessionInfo" class="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
      <h3 class="text-lg font-semibold text-white mb-4">Session Information</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p class="text-gray-300 text-sm">User ID</p>
          <p class="text-white font-medium">{{ authStore.currentUser?.id || 'N/A' }}</p>
        </div>
        <div>
          <p class="text-gray-300 text-sm">Username</p>
          <p class="text-white font-medium">{{ authStore.currentUser?.username || 'N/A' }}</p>
        </div>
        <div>
          <p class="text-gray-300 text-sm">Token Status</p>
          <div class="flex items-center space-x-2">
            <div class="w-2 h-2 bg-green-400 rounded-full"></div>
            <span class="text-green-400 text-sm">Valid</span>
          </div>
        </div>
        <div>
          <p class="text-gray-300 text-sm">Authentication Type</p>
          <p class="text-white font-medium">JWT Bearer Token</p>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="authStore.loading" class="flex items-center justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
      <span class="ml-3 text-blue-400">Processing...</span>
    </div>

    <!-- Error State -->
    <div v-if="authStore.hasError" class="bg-red-500/20 border border-red-400/50 text-red-200 px-4 py-3 rounded-lg">
      <div class="flex items-center space-x-2">
        <i class="pi pi-exclamation-triangle text-red-400"></i>
        <span class="font-medium">Authentication Error</span>
      </div>
      <p class="mt-1 text-sm">{{ authStore.error }}</p>
      <button
          @click="authStore.clearError"
          class="mt-2 text-sm text-red-300 hover:text-red-100 underline"
      >
        Close
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthenticationStore } from '../services/authentication.store.js'

// Props
const props = defineProps({
  title: {
    type: String,
    default: 'Authentication System'
  },
  description: {
    type: String,
    default: 'Manage platform access and security'
  },
  showQuickActions: {
    type: Boolean,
    default: true
  },
  showSessionInfo: {
    type: Boolean,
    default: true
  }
})

// Composables
const router = useRouter()
const authStore = useAuthenticationStore()

// Computed
const sectionTitle = computed(() => props.title)
const sectionDescription = computed(() => props.description)
const lastAccessTime = computed(() => {
  return new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
})

// Methods
const handleSignOut = () => {
  authStore.signOut()
  router.push('/iam/sign-in')
}

const navigateToSignIn = () => {
  if (!authStore.isLoggedIn) {
    router.push('/iam/sign-in')
  }
}

const navigateToSignUp = () => {
  if (!authStore.isLoggedIn) {
    router.push('/iam/sign-up')
  }
}

const refreshToken = () => {
  if (authStore.isLoggedIn) {
    // TODO: Implement token refresh logic
    console.log('Refreshing token...')
  }
}

// Lifecycle
onMounted(() => {
  authStore.initializeAuth()
})
</script>

<style scoped>
.authentication-section {
  @apply w-full;
}

/* Custom animations */
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.authentication-section > * {
  animation: fade-in 0.3s ease-out;
}
</style>