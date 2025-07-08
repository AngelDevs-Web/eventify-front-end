<script setup>
import { ref } from 'vue';
import profileService from '../services/profile.service.js';

// Profile creation form (fields in English for code clarity)
const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  street: '',
  number: '',
  city: '',
  postalCode: '',
  country: '',
  phoneNumber: '',
  webSite: '',
  biography: '',
  role: ''
});

const loading = ref(false);
const error = ref('');
const success = ref('');

/**
 * Handles profile creation
 */
async function submitForm() {
  loading.value = true;
  error.value = '';
  success.value = '';
  try {
    const createdProfile = await profileService.createProfile(form.value);
    success.value = 'Profile created successfully!';
    // Optionally, do something with createdProfile (e.g., redirect or display)
  } catch (err) {
    error.value = 'Error creating profile';
  } finally {
    loading.value = false;
  }
}
</script>
<template>
  <form @submit.prevent="submitForm">
    <div><input v-model="form.firstName" placeholder="First Name" required /></div>
    <div><input v-model="form.lastName" placeholder="Last Name" required /></div>
    <div><input v-model="form.email" type="email" placeholder="Email" required /></div>
    <div><input v-model="form.street" placeholder="Street" /></div>
    <div><input v-model="form.number" placeholder="Number" /></div>
    <div><input v-model="form.city" placeholder="City" /></div>
    <div><input v-model="form.postalCode" placeholder="Postal Code" /></div>
    <div><input v-model="form.country" placeholder="Country" /></div>
    <div><input v-model="form.phoneNumber" placeholder="Phone Number" /></div>
    <div><input v-model="form.webSite" placeholder="Website" /></div>
    <div><textarea v-model="form.biography" placeholder="Biography"></textarea></div>
    <div>
      <select v-model="form.role">
        <option value="">Select a role</option>
        <option value="Organizer">Organizer</option>
        <option value="Host">Host</option>
      </select>
    </div>
    <button type="submit" :disabled="loading">Create Profile</button>
    <div v-if="loading">Creating...</div>
    <div v-if="error" style="color:red">{{ error }}</div>
    <div v-if="success" style="color:green">{{ success }}</div>
  </form>
</template>
<style scoped>
form {
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem 1.5rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.06);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

input, select, textarea {  width: 100%;
  padding: 0.5rem 0.75rem;
  font-size: 1rem;
  border: 1px solid #bfc4ce;
  border-radius: 8px;
  background: #f7f9fa;
  transition: border 0.2s;
}

input:focus, select:focus, textarea:focus {
  outline: none;
  border-color: #3b82f6;
  background: #fff;
}

button[type="submit"] {
  background: #3b82f6;
  color: #fff;
  font-weight: 600;
  border: none;
  padding: 0.75rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
}

button[type="submit"]:hover:not(:disabled) {
  background: #2563eb;
}

button[disabled], button[disabled]:hover {
  background: #bfc4ce;
  cursor: not-allowed;
}

div[style*="color:red"], div[style*="color:green"] {
  padding: 0.25rem 0;
  font-size: 0.97rem;
}
</style>
