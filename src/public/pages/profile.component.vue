<template>
  <div class="profile-page-wrapper">
    <!-- Main title -->
    <h1 class="main-title">{{ $t('profilePage.title') }}</h1>

    <!-- Main content -->
    <div v-if="loading" class="loading-container">
      <span class="loading-text">{{ $t('profilePage.loading') }}</span>
    </div>

    <div v-else-if="error" class="error-container">
      <p class="error-text">{{ error }}</p>
      <button @click="loadProfileData" class="retry-button">{{ $t('common.retry') }}</button>
    </div>

    <div v-else>
      <div class="main-container">
        <!-- Navigation tabs -->
        <div class="tabs-row">
          <div
              v-for="tab in tabs"
              :key="tab.id"
              class="tab"
              :class="{ active: activeTab === tab.id }"
              @click="activeTab = tab.id"
          >
            {{ $t(tab.labelKey) }}
          </div>
        </div>

        <!-- Active tab content -->
        <div class="tab-content">
          <!-- Information tab -->
          <div v-if="activeTab === 'information'" class="tab-pane">
            <div class="tab-content-container">
              <!-- Main content -->
              <div class="content-area">
                <!-- Profile information component -->
                <profile-information
                    :profile-id="profileId"
                    :profile-image="user.profileImage"
                    :name="user.name"
                    :title="user.title"
                    :email="user.email"
                    :phone="user.phone"
                    :location="user.location"
                    :website="user.website"
                    :bio="user.bio"
                />
              </div>

              <!-- Sidebar with statistics and certifications -->
              <div class="sidebar-info">
                <!-- Statistics component -->
                <statistics-display
                    titleKey="statistics.title"
                    completedEventsLabelKey="statistics.completedEvents"
                    sentQuotesLabelKey="statistics.sentQuotes"
                    servedCustomersLabelKey="statistics.servedCustomers"
                    averageRatingLabelKey="statistics.averageRating"
                    :completed-events="statistics.completedEvents"
                    :sent-quotes="statistics.sentQuotes"
                    :served-customers="statistics.servedCustomers"
                    :average-rating="statistics.averageRating"
                />

                <!-- Certifications component -->
                <certifications-list
                    titleKey="certifications.title"
                    noCertificationsKey="certifications.noCertifications"
                    :certifications="certifications.list"
                />
              </div>
            </div>
          </div>

          <!-- Albums tab -->
          <div v-else-if="activeTab === 'albums'" class="tab-pane">
            <!-- Albums page component -->
            <albums-page-component :profileId="profileId" />
          </div>

          <!-- Reviews tab -->
          <div v-else-if="activeTab === 'reviews'" class="tab-pane">
            <!-- Reviews component -->
            <reviews-component />
          </div>

          <!-- Services tab -->
          <div v-else-if="activeTab === 'services'" class="tab-pane">
            <services-component :profile-id="profileId" />
          </div>

        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ProfileInformation from '../../profile-management/components/profile-information.component.vue';
import StatisticsDisplay from '../../profile-management/components/statistics-display.component.vue';
import CertificationsList from '../../profile-management/components/certifications-list.component.vue';
import AlbumsPageComponent from '../../profile-management/components/album-display.component.vue';
import ReviewsComponent from '../../profile-management/components/reviews.component.vue';
import ServicesComponent from '../../profile-management/components/services.component.vue';
//import ProfileSettingsPageComponent from '../../profile-management/components/profile-settings-page.component.vue';
import profileService from '../../shared/services/profile.service.js';
export default {
  name: 'ProfilePageComponent',
  // Accept id as a prop so router can provide the dynamic profile id
  props: {
    id: {
      type: [Number, String],
      default: null
    }
  },
  components: {
    ProfileInformation,
    StatisticsDisplay,
    CertificationsList,
    AlbumsPageComponent,
    ReviewsComponent,
    ServicesComponent,
    //ProfileSettingsPageComponent
  },
  data() {
    return {
      loading: true,
      error: null,
      profileId: 1,
      activeTab: 'information',
      tabs: [
        { id: 'information', labelKey: 'profilePage.tabs.information' },
        { id: 'albums', labelKey: 'profilePage.tabs.albums' },
        { id: 'reviews', labelKey: 'profilePage.tabs.reviews' },
        { id: 'services', labelKey: 'profilePage.tabs.services' },
      ],
      apiUrl: import.meta.env.VITE_API_BASE_URL,
      // Profile data with defaults to avoid undefined errors
      user: {
        profileImage: null,
        name: '',
        title: '',
        email: '',
        phone: '',
        location: '',
        website: '',
        bio: ''
      },
      statistics: {},
      certifications: { list: [] }
    };
  },
  created() {
    // Use the id prop if provided, otherwise fall back to the route param
    const routeId = this.id ?? this.$route.params.id;
    if (routeId) {
      this.profileId = parseInt(routeId);
    }
    this.loadProfileData();

    // Check if there is an active tab in the URL
    const urlParams = new URLSearchParams(window.location.search);
    const tab = urlParams.get('tab');
    if (tab && this.tabs.some(t => t.id === tab)) {
      this.activeTab = tab;
    }
  },
  methods: {
    async loadProfileData() {
      this.loading = true;
      this.error = null;

      try {
        const data = await profileService.getProfileData(this.profileId);
        this.user = data.user;
        this.statistics = data.statistics;
        this.certifications = data.certifications;
        this.loading = false;
      } catch (error) {
        console.error('Error loading profile data:', error);
        this.error = this.$t('profilePage.errorLoading');
        this.loading = false;
      }
    }
  },
  watch: {
    activeTab(newTab) {
      // Update URL with active tab
      const url = new URL(window.location);
      url.searchParams.set('tab', newTab);
      window.history.pushState({}, '', url);
    },
    // React when the route id changes (e.g., user navigates to another profile)
    '$route.params.id'(newId) {
      const parsed = newId ? parseInt(newId) : 1;
      if (parsed !== this.profileId) {
        this.profileId = parsed;
        this.loadProfileData();
      }
    },
    // Also react if the id prop changes directly via router props
    id(newId) {
      const parsed = newId ? parseInt(newId) : 1;
      if (parsed !== this.profileId) {
        this.profileId = parsed;
        this.loadProfileData();
      }
    }
  }
}
</script>

<style scoped>
/* Basic styles */
.profile-page-wrapper {
  width: 100%;
  max-width: 100%;
  background-color: #f5f5f7;
  padding: 20px;
  box-sizing: border-box;
  overflow-x: hidden;
  margin-top: 5px;
}

.main-title {
  font-size: 30px;
  color: #333;
  margin-bottom: 20px;
}

.main-container {
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* Navigation tabs */
.tabs-row {
  display: flex;
  background-color: #f5f5f7;
  border-bottom: 1px solid #eaeaea;
}

.tab {
  padding: 16px 24px;
  cursor: pointer;
  color: #666;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  position: relative;
}

.tab:hover {
  color: #333;
  background-color: rgba(0, 0, 0, 0.02);
}

.tab.active {
  color: #4ed8c7;
  background-color: #fff;
}

.tab.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background-color: #4ed8c7;
}

/* Tab content */
.tab-content {
  min-height: 400px;
}

.tab-pane {
  padding: 0;
}

.tab-content-container {
  display: flex;
  padding: 20px;
  gap: 20px;
}

.content-area {
  flex: 1;
  min-width: 0;
}

/* Sidebar */
.sidebar-info {
  width: 300px;
  flex-shrink: 0;
  margin-top: 0;
}

/* Coming Soon section */
.coming-soon {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  text-align: center;
  color: #666;
}

.coming-soon h3 {
  font-size: 24px;
  margin-bottom: 10px;
  color: #333;
}

/* Loading and error state styles */
.loading-container, .error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  width: 100%;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.loading-text {
  font-size: 18px;
  color: #666;
}

.error-text {
  font-size: 16px;
  color: #e53e3e;
  margin-bottom: 16px;
}

.retry-button {
  padding: 8px 16px;
  background-color: #4ed8c7;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.retry-button:hover {
  background-color: #3cc0af;
}

/* Responsive */
@media (max-width: 992px) {
  .tab-content-container {
    flex-direction: column;
  }

  .sidebar-info {
    width: 100%;
    margin-top: 20px;
  }
}

@media (max-width: 768px) {
  .tabs-row {
    overflow-x: auto;
    white-space: nowrap;
  }

  .tab {
    padding: 12px 16px;
  }
}

@media (max-width: 480px) {
  .main-title {
    font-size: 24px;
  }

  .profile-page-wrapper {
    padding: 10px;
  }
}
</style>