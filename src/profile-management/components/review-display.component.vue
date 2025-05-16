<script>
import ReviewsComponent from '../components/reviews.component.vue';

export default {
  name: 'ReviewPageComponent',
  components: {
    ReviewsComponent
  },
  setup() {
    return {
      activeTab: 'reviews'
    };
  }
};
</script>

<template>
  <div class="profile-container">
    <h1 class="profile-title">My Profile</h1>

    <div class="profile-tabs">
      <div class="profile-tab-buttons">
        <button
            class="tab-button"
            :class="{ 'active': activeTab === 'information' }"
            @click="activeTab = 'information'"
        >
          Information
        </button>
        <button
            class="tab-button"
            :class="{ 'active': activeTab === 'albums' }"
            @click="activeTab = 'albums'"
        >
          Albums
        </button>
        <button
            class="tab-button"
            :class="{ 'active': activeTab === 'reviews' }"
            @click="activeTab = 'reviews'"
        >
          Reviews
        </button>
        <button
            class="tab-button"
            :class="{ 'active': activeTab === 'services' }"
            @click="activeTab = 'services'"
        >
          Services
        </button>
        <button
            class="tab-button"
            :class="{ 'active': activeTab === 'settings' }"
            @click="activeTab = 'settings'"
        >
          Settings
        </button>
      </div>

      <div class="profile-tab-content">
        <reviews-component v-if="activeTab === 'reviews'" />
        <div v-else-if="activeTab === 'information'" class="tab-placeholder">
          <p>Information content will be displayed here</p>
        </div>
        <div v-else-if="activeTab === 'albums'" class="tab-placeholder">
          <p>Albums content will be displayed here</p>
        </div>
        <div v-else-if="activeTab === 'services'" class="tab-placeholder">
          <p>Services content will be displayed here</p>
        </div>
        <div v-else-if="activeTab === 'settings'" class="tab-placeholder">
          <p>Settings content will be displayed here</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-container {
  padding: 20px;
  font-family: Arial, sans-serif;
}

.profile-title {
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
}

.profile-tabs {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
}

.profile-tab-buttons {
  display: flex;
  border-bottom: 1px solid #e0e0e0;
  background-color: #f5f5f5;
}

.tab-button {
  padding: 12px 16px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.2s;
}

.tab-button:hover {
  background-color: #ebebeb;
}

.tab-button.active {
  border-bottom: 2px solid #20c997;
  color: #20c997;
}

.profile-tab-content {
  padding: 20px;
  background-color: white;
}

.tab-placeholder {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-style: italic;
}
</style>