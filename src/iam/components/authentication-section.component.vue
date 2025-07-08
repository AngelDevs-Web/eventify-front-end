<script>
import {useRouter} from "vue-router";
import {useAuthenticationStore} from "../services/authentication.store.js";

/**
 * Authentication section component
 * @summary
 * Display sign in, sign up, sign out buttons.
 * If a user is signed in, display welcome message and sign out button, otherwise display sign in and sign up buttons.
 */
export default {
  name: "authentication-section",
  data() {
    return {
      router: useRouter(),
      authenticationStore: useAuthenticationStore()
    };
  },
  computed: {
    /**
     * Check if user is signed in
     * @returns {boolean} true if user is signed in
     */
    isSignedIn() {
      return this.authenticationStore.isSignedIn;
    },
    /**
     * Get current username
     * @returns {string} current username
     */
    currentUsername() {
      return this.authenticationStore.currentUsername;
    },
  },
  methods: {
    /**
     * Sign in
     * @summary
     * Redirect to sign in page
     */
    onSignIn() {
      this.router.push({name: "sign-in"});
    },
    /**
     * Sign up
     * @summary
     * Redirect to sign up page
     */
    onSignUp() {
      this.router.push({name: "sign-up"});
    },
    /**
     * Sign out
     * @summary
     * Sign out user
     */
    onSignOut() {
      this.authenticationStore.signOut(this.router);
    }
  }
}
</script>

<template>
  <div>
    <div v-if="isSignedIn">
      <span class="p-button-text bg-primary"> {{ $t('authentication-section.welcome') }}, {{ currentUsername }}</span>
      <pv-button text  class="bg-primary" @click="onSignOut">{{ $t('authentication-section.sign-out') }}</pv-button>
    </div>
    <div v-else>
      <pv-button text  class="bg-primary" @click="onSignIn">{{ $t('authentication-section.sign-in') }}</pv-button>
      <pv-button text  class="bg-primary" @click="onSignUp">{{ $t('authentication-section.sign-up') }}</pv-button>
    </div>
  </div>
</template>

<style scoped>

</style>