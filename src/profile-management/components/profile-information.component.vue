<script setup>
import { ref, computed, onMounted } from 'vue';
import profileService from '../services/profile.service.js';
import { profile as ProfileEntity } from '../model/profile.entity.js';

const profileId = 1; // TODO: Replace with dynamic ID as needed

const profile = ref(null);
const backupProfile = ref(null); // For canceling edits
const loading = ref(false);
const error = ref('');
const success = ref('');
const isEditing = ref(false);

/**
 * Adapter: Converts backend response to frontend model
 */
function adaptProfile(response) {
  // Split fullName if available
  let nombre = '';
  let apellido = '';
  if (response.fullName) {
    const parts = response.fullName.split(' ');
    nombre = parts[0] || '';
    apellido = parts.slice(1).join(' ') || '';
  }
  return {
    id: response.id,
    nombre,
    apellido,
    titulo: response.role || '',
    avatarUrl: response.profileImage || '',
    email: response.email || '',
    telefono: response.phone || '',
    ubicacion: response.streetAddress || '',
    sitioWeb: response.website || '',
    biografia: response.bio || ''
  };
}

/**
 * Fetches profile from backend and adapts it to the frontend model
 */
async function fetchProfile() {
  loading.value = true;
  error.value = '';
  success.value = '';
  try {
    const response = await profileService.getProfileById(profileId);
    profile.value = ProfileEntity.fromJSON(adaptProfile(response));
    backupProfile.value = ProfileEntity.fromJSON(adaptProfile(response));
  } catch (err) {
    error.value = 'Error loading profile';
  } finally {
    loading.value = false;
  }
}

/**
 * Saves edited profile to backend
 */
async function saveProfile() {
  loading.value = true;
  error.value = '';
  success.value = '';
  try {
    // Prepare payload for backend
    const payload = {
      fullName: `${profile.value.nombre} ${profile.value.apellido}`,
      email: profile.value.email,
      streetAddress: profile.value.ubicacion,
      role: profile.value.titulo,
      website: profile.value.sitioWeb,
      bio: profile.value.biografia,
      // Add more fields as needed if backend supports them
    };
    const updated = await profileService.updateProfile(profileId, payload);
    profile.value = ProfileEntity.fromJSON(adaptProfile(updated));
    backupProfile.value = ProfileEntity.fromJSON(adaptProfile(updated));
    isEditing.value = false;
    success.value = 'Profile updated successfully!';
  } catch (err) {
    error.value = 'Error saving profile';
  } finally {
    loading.value = false;
  }
}

/**
 * Cancels editing and restores original values
 */
function cancelEdit() {
  isEditing.value = false;
  error.value = '';
  success.value = '';
  if (backupProfile.value) {
    profile.value = ProfileEntity.fromJSON(backupProfile.value.toJSON());
  }
}

// Computed properties for template bindings
const name = computed(() => profile.value ? profile.value.fullName : '');
const title = computed(() => profile.value ? profile.value.titulo : '');
const email = computed(() => profile.value ? profile.value.email : '');
const phone = computed(() => profile.value ? profile.value.telefono : '');
const location = computed(() => profile.value ? profile.value.ubicacion : '');
const website = computed(() => profile.value ? profile.value.sitioWeb : '');
const bio = computed(() => profile.value ? profile.value.biografia : '');
const profileImage = computed(() => profile.value ? profile.value.avatarUrl : 'placeholder');

onMounted(fetchProfile);
</script>
<template>
  <div class="profile-info-container">
    <div class="profile-header">
      <div class="avatar-container">
        <div class="avatar-wrapper">
          <div v-if="!profileImage || profileImage === 'placeholder'" class="avatar-placeholder">
            {{ $t('profile.profilePhoto') }}
          </div>
          <img v-else :src="profileImage" :alt="$t('profile.profilePhoto')" class="profile-avatar" />
          <div class="avatar-shadow"></div>
        </div>
      </div>
      <h2 class="profile-name">{{ name }}</h2>
      <p class="profile-title">{{ title }}</p>
    </div>

    <div class="centered-content">
      <div class="contact-section">
        <h3 class="section-title">{{ $t('profile.contactInformation') }}</h3>

        <div class="contact-grid">
          <div class="contact-row">
            <div class="contact-label">{{ $t('profile.emailAddress') }}</div>
            <div class="contact-value" v-if="!isEditing">{{ email }}</div>
            <input v-else v-model="profile.email" placeholder="Email" />
          </div>

          <div class="contact-row">
            <div class="contact-label">{{ $t('profile.phoneNumber') }}</div>
            <div class="contact-value" v-if="!isEditing">{{ phone }}</div>
            <input v-else v-model="profile.telefono" placeholder="Phone" />
          </div>

          <div class="contact-row">
            <div class="contact-label">{{ $t('profile.location') }}</div>
            <div class="contact-value" v-if="!isEditing">{{ location }}</div>
            <input v-else v-model="profile.ubicacion" placeholder="Location" />
          </div>

          <div class="contact-row">
            <div class="contact-label">{{ $t('profile.website') }}</div>
            <div class="contact-value" v-if="!isEditing">
              <a :href="website" class="website-link">{{ website }}</a>
            </div>
            <input v-else v-model="profile.sitioWeb" placeholder="Website" />
          </div>
        </div>
      </div>

      <div class="about-section">
        <h3 class="section-title">{{ $t('profile.aboutMe') }}</h3>
        <p class="about-text" v-if="!isEditing">{{ bio }}</p>
        <textarea v-else v-model="profile.biografia" placeholder="Biography"></textarea>
      </div>

      <div style="margin-top:2rem;">
        <button v-if="!isEditing" @click="isEditing = true">Edit</button>
        <button v-else @click="saveProfile" :disabled="loading">Save</button>
        <button v-if="isEditing" @click="cancelEdit" :disabled="loading">Cancel</button>
        <div v-if="error" style="color:red; margin-top:0.5rem;">{{ error }}</div>
        <div v-if="success" style="color:green; margin-top:0.5rem;">{{ success }}</div>
        <div v-if="loading" style="margin-top:0.5rem;">Saving...</div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.profile-info-container {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 10px rgba(0, 0, 0, 0.05);
  padding: 30px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Header section with photo and name */
.profile-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
  width: 100%;
}

.avatar-container {
  margin-bottom: 15px;
  position: relative;
}

/* Wrapper for avatar and its shadow */
.avatar-wrapper {
  position: relative;
  width: 150px;
  height: 150px;
  border-radius: 50%;
}

/* Styles for the profile image */
.profile-avatar {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  position: relative;
  z-index: 2;
}

/* Styles for the placeholder when there is no image */
.avatar-placeholder {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background-color: #e8eeff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6366f1;
  font-size: 14px;
  position: relative;
  z-index: 2;
}

/* Shadow effect below the avatar */
.avatar-shadow {
  position: absolute;
  bottom: -10px;
  left: 0;
  right: 0;
  height: 20px;
  background: radial-gradient(ellipse at center, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0) 70%);
  z-index: 1;
  border-radius: 50%;
  margin: 0 10px;
}

.profile-name {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin: 15px 0 5px 0;
  text-align: center;
}

.profile-title {
  font-size: 16px;
  color: #666;
  margin: 0 0 20px 0;
  text-align: center;
}

/* Central container with limited width */
.centered-content {
  max-width: 600px;
  width: 100%;
}

/* Contact information section */
.section-title {
  text-align: left;
  font-size: 18px;
  color: #333;
  margin: 0 0 20px 0;
  font-weight: 600;
  border-bottom: none;
}

.contact-grid {
  text-align: left;
  margin-bottom: 30px;
}

.contact-row {
  display: flex;
  margin-bottom: 15px;
}

.contact-label {
  min-width: 130px;
  font-weight: 500;
  color: #666;
}

.contact-value {
  color: #333;
}

.website-link {
  color: #3b82f6;
  text-decoration: none;
}

.website-link:hover {
  text-decoration: underline;
}

/* About me section */
.about-section {
  margin-bottom: 5px;
}

.about-text {
  text-align: justify;
  line-height: 1.6;
  color: #555;
}

/* Responsive */
@media (max-width: 768px) {
  .centered-content {
    max-width: 100%;
  }

  .contact-row {
    flex-direction: column;
  }

  .contact-label {
    margin-bottom: 5px;
  }
}
</style>
