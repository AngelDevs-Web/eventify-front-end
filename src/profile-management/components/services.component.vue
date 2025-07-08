<script>
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import serviceService from '../services/service.service';
import CreateAndEditServiceComponent from './create-and-edit-services.component.vue';

export default {
  name: 'ServicesComponent',
  components: {
    CreateAndEditServiceComponent
  },
  props: {
    profileId: {
      type: [Number, String],
      required: true
    }
  },
  setup(props) {
    const { t } = useI18n();
    const services = ref([]);
    const loading = ref(false);
    const error = ref(null);
    const showAddModal = ref(false);
    const editingService = ref(null);
    const showDeleteConfirm = ref(false);
    const serviceToDelete = ref(null);
    const currentPage = ref(1);
    const itemsPerPage = ref(5);

    // Loading states for better profile feedback
    const savingService = ref(false);
    const deletingService = ref(false);

    // Success message states
    const successMessage = ref('');
    const showSuccessMessage = ref(false);

    // Server connection state
    const serverConnected = ref(true);

    // Calculate paginated services
    const paginatedServices = computed(() => {
      const startIndex = (currentPage.value - 1) * itemsPerPage.value;
      const endIndex = startIndex + itemsPerPage.value;
      return services.value.slice(startIndex, endIndex);
    });

    // Calculate total pages
    const totalPages = computed(() => {
      return Math.ceil(services.value.length / itemsPerPage.value) || 1;
    });

    // Get pages to display in pagination
    const displayedPages = computed(() => {
      const maxVisiblePages = 5;
      const pages = [];

      let startPage = Math.max(1, currentPage.value - Math.floor(maxVisiblePages / 2));
      let endPage = Math.min(totalPages.value, startPage + maxVisiblePages - 1);

      if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      return pages;
    });

    // Check server connection
    const checkServerConnection = async () => {
      try {
        const response = await fetch(
            `${serviceService.baseUrl}/profiles/${props.profileId}/service-catalogs`,
            {
              method: 'HEAD',
              signal: AbortSignal.timeout(3000)
            }
        );
        serverConnected.value = response.ok;
      } catch (error) {
        console.warn('Server connection check failed:', error);
        serverConnected.value = false;
      }
      return serverConnected.value;
    };

    // Load profile services
    const fetchServices = async () => {
      loading.value = true;
      error.value = null;

      try {
        console.log(`Fetching services for profile ${props.profileId}...`);

        const result = await serviceService.getServicesByUserId(props.profileId);

        console.log('Fetched services result:', result);

        // Verify API response has expected structure and contains services
        if (Array.isArray(result)) {
          services.value = result;
          console.log(`Assigned ${result.length} services to the component`);

          // Debug each service to verify IDs
          result.forEach((service, index) => {
            console.log(`Service ${index}:`, service);
            if (!service.id && service.id !== 0) {
              console.warn(`Service at index ${index} has no ID:`, service);
            }
          });
        } else {
          console.error('Unexpected API response format:', result);
          throw new Error('Invalid data format received from server');
        }

        // Force reset to first page when fetching new data
        currentPage.value = 1;
      } catch (err) {
        console.error('Error fetching services:', err);
        error.value = err.message || t('services.errorLoading');
        // Provide fallback error message if translation fails
        if (error.value === 'services.errorLoading') {
          error.value = 'Error loading services. Please try again.';
        }
      } finally {
        loading.value = false;
      }
    };

    // Open modal to add a service
    const openAddServiceModal = () => {
      editingService.value = null;
      error.value = null;
      showAddModal.value = true;
    };

    // Open modal to edit a service
    const openEditServiceModal = (service) => {
      console.log('Opening edit modal for service:', service);
      // Create a copy to avoid direct modification
      editingService.value = { ...service };
      error.value = null;
      showAddModal.value = true;
    };

    // Close modal with reset
    const closeModal = () => {
      showAddModal.value = false;
      editingService.value = null;
      savingService.value = false;
    };

    // Show success message temporarily
    const showSuccess = (message) => {
      successMessage.value = message;
      showSuccessMessage.value = true;

      // Auto-hide after 3 seconds
      setTimeout(() => {
        showSuccessMessage.value = false;
      }, 3000);
    };

    // Save service (create or update)
    const handleServiceSaved = async (result) => {
      console.log('Service save result:', result);
      savingService.value = true;

      try {
        // Check if child component returned success information
        if (result && result.success) {
          // Explicitly reload services after a successful save
          await fetchServices();

          // Verify services were loaded
          console.log(`After save: ${services.value.length} services loaded`);

          closeModal();

          // Use result message or fallback
          const message = result.message ||
              (editingService.value ? 'Service updated successfully' : 'Service created successfully');

          showSuccess(message);
        } else {
          // Handle case where child component indicates error
          console.error('Error from save operation:', result?.error || 'Unknown error');

          // Use returned error or fallback
          error.value = result?.error || 'Error saving service. Please try again.';
        }
      } catch (err) {
        console.error('Error handling service save:', err);
        error.value = err.message || 'Error processing save operation';
      } finally {
        savingService.value = false;
      }
    };

    // Show delete confirmation
    const confirmDelete = (service) => {
      console.log('Confirming deletion of service:', service);
      serviceToDelete.value = service;
      error.value = null;
      showDeleteConfirm.value = true;
    };

    // Cancel deletion
    const cancelDelete = () => {
      serviceToDelete.value = null;
      showDeleteConfirm.value = false;
      deletingService.value = false;
      error.value = null;
    };

    // Delete service
    const deleteService = async () => {
      if (!serviceToDelete.value) return;

      deletingService.value = true;
      error.value = null;

      try {
        console.log(`Starting deletion of service ${serviceToDelete.value.id}...`);

        // Verify service ID is valid
        if (!serviceToDelete.value.id && serviceToDelete.value.id !== 0) {
          throw new Error('Invalid service ID');
        }

        // Attempt to delete the service
        const result = await serviceService.deleteService(serviceToDelete.value.id, props.profileId);

        console.log('Delete service result:', result);

        // If we reach here, deletion was successful
        await fetchServices();
        showDeleteConfirm.value = false;
        serviceToDelete.value = null;

        // Show success message
        showSuccess('Service deleted successfully');

      } catch (err) {
        console.error('Error deleting service:', err);

        // Provide meaningful error message based on error type
        let errorMessage;

        if (err.message && err.message.includes('timeout')) {
          errorMessage = 'The operation timed out. Server might be busy.';
        } else if (err.message && err.message.includes('connect')) {
          errorMessage = 'Cannot connect to server. Please check your connection.';
        } else if (err.message && err.message.includes('404')) {
          errorMessage = 'The service does not exist or was already deleted.';
        } else if (err.message && err.message.includes('403')) {
          errorMessage = 'You do not have permission to delete this service.';
        } else {
          errorMessage = 'Error deleting service. Please try again.';
        }

        error.value = errorMessage;
      } finally {
        deletingService.value = false;
      }
    };

    // Retry delete with longer timeout
    const deleteServiceWithTimeout = async () => {
      if (!serviceToDelete.value) return;

      deletingService.value = true;
      error.value = null;

      try {
        console.log(`Retrying deletion of service ${serviceToDelete.value.id} with extended timeout...`);

        // Use a longer timeout for the retry attempt
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 seconds

        const response = await fetch(`${serviceService.baseUrl}/profiles/${props.profileId}/service-catalogs/${serviceToDelete.value.id}`, {
          method: 'DELETE',
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        // If successful, update UI
        await fetchServices();
        showDeleteConfirm.value = false;
        serviceToDelete.value = null;
        showSuccess('Service deleted successfully');

      } catch (err) {
        console.error('Error in deletion retry:', err);
        error.value = err.name === 'AbortError'
            ? 'The operation timed out. Please try again later.'
            : 'Error deleting service. Please try again.';
      } finally {
        deletingService.value = false;
      }
    };

    // Go to previous page
    const goToPreviousPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--;
      }
    };

    // Go to next page
    const goToNextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++;
      }
    };

    // Go to specific page
    const goToPage = (page) => {
      if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
      }
    };

    // When component mounts
    onMounted(async () => {
      // Check connection first
      await checkServerConnection();
      // Then load services
      await fetchServices();
    });

    return {
      t,
      services,
      loading,
      error,
      showAddModal,
      editingService,
      showDeleteConfirm,
      serviceToDelete,
      currentPage,
      totalPages,
      paginatedServices,
      displayedPages,
      savingService,
      deletingService,
      successMessage,
      showSuccessMessage,
      serverConnected,
      fetchServices,
      openAddServiceModal,
      openEditServiceModal,
      closeModal,
      handleServiceSaved,
      confirmDelete,
      cancelDelete,
      deleteService,
      deleteServiceWithTimeout,
      goToPreviousPage,
      goToNextPage,
      goToPage,
      checkServerConnection
    };
  }
};
</script>

<template>
  <div class="services-container">
    <!-- Header -->
    <div class="services-header">
      <div>
        <h2 class="section-title">{{ t('services.myServices') }}</h2>
        <p class="section-description">{{ t('services.defineServices') }}</p>
      </div>
      <button class="add-service-btn" @click="openAddServiceModal">
        + {{ t('services.addService') }}
      </button>
    </div>

    <!-- Success message notification -->
    <div v-if="showSuccessMessage" class="success-notification">
      <p>{{ successMessage }}</p>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>{{ t('services.loadingServices') }}</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="error-state">
      <p>{{ error }}</p>
      <button @click="fetchServices" class="retry-button">{{ t('services.retry') }}</button>
    </div>

    <!-- Empty state -->
    <div v-else-if="services.length === 0" class="empty-state">
      <p>{{ t('services.noServices') }}</p>
      <button @click="openAddServiceModal" class="add-first-btn">
        {{ t('services.addYourFirst') }}
      </button>
    </div>

    <!-- Services list -->
    <div v-else class="services-list">
      <div v-for="service in paginatedServices" :key="service.id" class="service-item">
        <div class="service-content">
          <h3 class="service-title">{{ service.title }}</h3>
          <p class="service-description">{{ service.description }}</p>
          <p class="service-price">
            <span class="price-label">{{ t('services.basePrice') }}</span>
            <span class="price-value">{{ service.currency }} {{ service.priceFrom.toLocaleString() }}{{ service.priceTo > service.priceFrom ? ' - ' + service.currency + ' ' + service.priceTo.toLocaleString() : '' }}</span>
          </p>
        </div>

        <div class="service-actions">
          <button class="edit-btn" @click="openEditServiceModal(service)">
            {{ t('services.edit') }}
          </button>
          <button class="delete-btn" @click="confirmDelete(service)">
            {{ t('services.delete') }}
          </button>
        </div>
      </div>

      <!-- Pagination - Always show if there are services -->
      <div class="pagination">
        <p>{{ t('services.page', { current: currentPage, total: totalPages }) }}</p>
        <div class="pagination-controls">
          <button
              :disabled="currentPage === 1"
              @click="goToPreviousPage"
              class="pagination-btn"
          >
            &lt;&lt;{{ t('services.previous') }}
          </button>

          <span v-for="page in displayedPages" :key="page"
                class="page-number"
                :class="{ 'active': currentPage === page }"
                @click="goToPage(page)"
          >
            {{ page }}
          </span>

          <button
              :disabled="currentPage === totalPages"
              @click="goToNextPage"
              class="pagination-btn"
          >
            {{ t('services.next') }}&gt;&gt;
          </button>
        </div>
      </div>
    </div>

    <!-- Modal for create/edit service -->
    <div v-if="showAddModal" class="modal-backdrop">
      <div class="modal-content">
        <create-and-edit-service-component
            :service="editingService"
            :profile-id="profileId"
            @save="handleServiceSaved"
            @cancel="closeModal"
        />
        <!-- Added loading indicator while saving -->
        <div v-if="savingService" class="modal-loading-overlay">
          <div class="spinner"></div>
          <p>{{ t('services.saving') }}</p>
        </div>
      </div>
    </div>

    <!-- Confirmation modal for delete -->
    <div v-if="showDeleteConfirm" class="modal-backdrop">
      <div class="modal-confirm">
        <h3>{{ t('services.deleteService') }}</h3>
        <p>{{ t('services.confirmDelete') }}</p>
        <!-- Show error if delete operation failed -->
        <p v-if="error" class="modal-error">{{ error }}</p>
        <div class="confirm-actions">
          <button
              class="cancel-btn"
              @click="cancelDelete"
              :disabled="deletingService"
          >{{ t('services.cancel') }}</button>
          <button
              class="confirm-btn"
              @click="deleteService"
              :disabled="deletingService"
          >
            <span v-if="deletingService" class="spinner small"></span>
            {{ t('services.delete') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.services-container {
  padding: 30px;
  position: relative;
  text-align: left;
}

.services-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
}

.section-description {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.add-service-btn {
  background-color: #4ed8c7;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.add-service-btn:hover {
  background-color: #3cc0af;
}

/* Success notification - New */
.success-notification {
  background-color: #d4edda;
  color: #155724;
  padding: 10px 15px;
  border-radius: 4px;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.loading-state, .error-state, .empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  margin-top: 20px;
  text-align: center;
}

.retry-button, .add-first-btn {
  margin-top: 10px;
  padding: 8px 16px;
  background-color: #4ed8c7;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.retry-button:hover, .add-first-btn:hover {
  background-color: #3cc0af;
}

.services-list {
  margin-top: 20px;
}

.service-item {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.service-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 10px 0;
}

.service-description {
  font-size: 14px;
  color: #666;
  margin: 0 0 10px 0;
}

.service-price {
  margin: 0;
  font-size: 14px;
}

.price-label {
  color: #666;
  margin-right: 4px;
}

.price-value {
  font-weight: 600;
  color: #333;
}

.service-actions {
  display: flex;
  gap: 10px;
}

.edit-btn, .delete-btn {
  padding: 8px 16px;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.edit-btn {
  background-color: #f0f0f0;
  color: #333;
  border: 1px solid #ddd;
}

.edit-btn:hover {
  background-color: #e0e0e0;
}

.delete-btn {
  background-color: #ffeeee;
  color: #d9534f;
  border: 1px solid #ffcccc;
}

.delete-btn:hover {
  background-color: #ffdddd;
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}

.pagination p {
  margin: 0;
  font-size: 14px;
  color: #666;
}

.pagination-controls {
  display: flex;
  align-items: center;
}

.pagination-btn {
  padding: 6px 12px;
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  margin: 0 5px;
  font-size: 14px;
  transition: all 0.2s;
}

.pagination-btn:hover:not(:disabled) {
  background-color: #4ed8c7;
  color: white;
  border-color: #4ed8c7;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-number {
  display: inline-block;
  width: 30px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  margin: 0 5px;
  border-radius: 4px;
  cursor: pointer;
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  font-size: 14px;
  transition: all 0.2s;
}

.page-number:hover {
  background-color: #e0e0e0;
}

.page-number.active {
  background-color: #4ed8c7;
  color: white;
  border-color: #4ed8c7;
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

/* Loading overlay for the modal - New */
.modal-loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

.modal-confirm {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  max-width: 400px;
  width: 90%;
  text-align: center;
}

.modal-confirm h3 {
  margin-top: 0;
  color: #333;
}

/* Error message in modal - New */
.modal-error {
  color: #721c24;
  background-color: #f8d7da;
  padding: 8px 12px;
  border-radius: 4px;
  margin: 10px 0;
  font-size: 14px;
}

.confirm-actions {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;
}

.cancel-btn, .confirm-btn {
  padding: 8px 16px;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-btn {
  background-color: #f0f0f0;
  color: #333;
  border: 1px solid #ddd;
}

.confirm-btn {
  background-color: #d9534f;
  color: white;
  border: 1px solid #d9534f;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cancel-btn:hover:not(:disabled) {
  background-color: #e0e0e0;
}

.confirm-btn:hover:not(:disabled) {
  background-color: #c9302c;
}

.cancel-btn:disabled, .confirm-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Spinner for loading indicators - New */
.spinner {
  width: 24px;
  height: 24px;
  border: 3px solid rgba(78, 216, 199, 0.3);
  border-radius: 50%;
  border-top-color: #4ed8c7;
  animation: spin 1s linear infinite;
  margin-bottom: 10px;
}

.spinner.small {
  width: 16px;
  height: 16px;
  border-width: 2px;
  margin: 0 8px 0 0;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .services-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .add-service-btn {
    width: 100%;
  }

  .service-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .service-actions {
    margin-top: 15px;
    width: 100%;
    justify-content: space-between;
  }

  .edit-btn, .delete-btn {
    flex: 1;
  }

  .pagination {
    flex-direction: column;
    gap: 10px;
  }
}
</style>