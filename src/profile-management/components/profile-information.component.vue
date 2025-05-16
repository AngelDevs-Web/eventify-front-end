<script>
export default {
  name: 'ProfileInformation',
  props: {
    profileImage: {
      type: String,
      default: 'placeholder'
    },
    name: {
      type: String,
      default: ' '
    },
    title: {
      type: String,
      default: ' '
    },
    email: {
      type: String,
      default: ' '
    },
    phone: {
      type: String,
      default: ' '
    },
    location: {
      type: String,
      default: ' '
    },
    website: {
      type: String,
      default: ' '
    },
    bio: {
      type: String,
      default: ''
    }
  }
}
</script>

<template>
  <div class="profile-info-container">
    <!-- Photo and name section with shadow effect -->
    <div class="profile-header">
      <div class="avatar-container">
        <div class="avatar-wrapper">
          <!-- Use a div as placeholder when there is no image -->
          <div v-if="!profileImage || profileImage === 'placeholder'" class="avatar-placeholder">
            {{ $t('profile.profilePhoto') }}
          </div>
          <!-- Show the image if it exists -->
          <img v-else :src="profileImage" :alt="$t('profile.profilePhoto')" class="profile-avatar" />
          <div class="avatar-shadow"></div>
        </div>
      </div>
      <h2 class="profile-name">{{ name }}</h2>
      <p class="profile-title">{{ title }}</p>
    </div>

    <!-- Central container with limited width for Contact Info and About me -->
    <div class="centered-content">
      <!-- Contact information section -->
      <div class="contact-section">
        <h3 class="section-title">{{ $t('profile.contactInformation') }}</h3>

        <div class="contact-grid">
          <div class="contact-row">
            <div class="contact-label">{{ $t('profile.emailAddress') }}</div>
            <div class="contact-value">{{ email }}</div>
          </div>

          <div class="contact-row">
            <div class="contact-label">{{ $t('profile.phoneNumber') }}</div>
            <div class="contact-value">{{ phone }}</div>
          </div>

          <div class="contact-row">
            <div class="contact-label">{{ $t('profile.location') }}</div>
            <div class="contact-value">{{ location }}</div>
          </div>

          <div class="contact-row">
            <div class="contact-label">{{ $t('profile.website') }}</div>
            <div class="contact-value">
              <a :href="website" class="website-link">{{ website }}</a>
            </div>
          </div>
        </div>
      </div>

      <!-- "About me" section -->
      <div class="about-section">
        <h3 class="section-title">{{ $t('profile.aboutMe') }}</h3>
        <p class="about-text">{{ bio }}</p>
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
