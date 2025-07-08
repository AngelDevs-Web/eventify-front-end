<script>
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { Service } from '../model/service.entity';
import serviceService from '../services/service.service';

export default {
  name: 'CreateAndEditServiceComponent',
  props: {
    service: {
      type: Object,
      default: null
    },
    profileId: {
      type: [Number, String],
      required: true
    }
  },
  emits: ['save', 'cancel'],
  setup(props, { emit }) {
    const { t } = useI18n();
    const isEditing = computed(() => !!props.service);
    const title = ref('');
    const description = ref('');
    const currency = ref('S/');
    const priceFrom = ref(0);
    const priceTo = ref(0);
    const category = ref('');
    const loading = ref(false);
    const error = ref(null);

    // Load service data if in edit mode
    onMounted(() => {
      if (props.service) {
        console.log('Loading service for editing:', props.service);
        title.value = props.service.title || '';
        description.value = props.service.description || '';
        currency.value = props.service.currency || 'S/';
        priceFrom.value = props.service.priceFrom || 0;
        priceTo.value = props.service.priceTo || 0;
        category.value = props.service.category || '';
      }
    });

    // Data validation
    const isValid = computed(() => {
      return (
          title.value.trim() !== '' &&
          description.value.trim() !== '' &&
          !isNaN(priceFrom.value) &&
          !isNaN(priceTo.value) &&
          priceFrom.value >= 0 &&
          priceTo.value >= priceFrom.value
      );
    });

    // Save service
    const saveService = async () => {
      if (!isValid.value) return;

      loading.value = true;
      error.value = null;

      try {
        // Create service object
        const serviceData = {
          title: title.value.trim(),
          description: description.value.trim(),
          currency: currency.value,
          priceFrom: parseFloat(priceFrom.value),
          priceTo: parseFloat(priceTo.value),
          category: category.value.trim(),
          profileId: props.profileId
        };

        console.log('About to save service with data:', serviceData);

        let savedService;

        // If editing, update the service
        if (isEditing.value) {
          // Ensure ID is carried over
          serviceData.id = props.service.id;
          serviceData.createdAt = props.service.createdAt || new Date().toISOString();
          serviceData.updatedAt = new Date().toISOString();
          serviceData.isActive = props.service.isActive !== undefined ? props.service.isActive : true;

          console.log('Updating service with data:', serviceData);

          // Create Service instance - PASA UN OBJETO, NO PARÁMETROS INDIVIDUALES
          const service = new Service(serviceData);
          console.log('Service object created:', service);
          console.log('Service DTO:', service.toDTO());

          savedService = await serviceService.updateService(service);
          console.log('Service updated successfully:', savedService);
        }
        // If creating, create a new service
        else {
          serviceData.createdAt = new Date().toISOString();
          serviceData.updatedAt = new Date().toISOString();
          serviceData.isActive = true;
          // No incluir ID para que JSON Server lo genere

          console.log('Creating service with data:', serviceData);

          // Create Service instance - PASA UN OBJETO, NO PARÁMETROS INDIVIDUALES
          const service = new Service(serviceData);
          console.log('Service object created:', service);
          console.log('Service DTO:', service.toDTO());

          savedService = await serviceService.createService(service);
          console.log('Service created successfully:', savedService);
        }

        console.log('Service saved with ID:', savedService?.id);

        // Emit save event with success information and service ID
        emit('save', {
          success: true,
          serviceId: savedService?.id || props.service?.id,
          service: savedService,
          message: isEditing.value
              ? 'Service updated successfully'
              : 'Service created successfully'
        });
      } catch (err) {
        console.error('Error saving service:', err);
        console.error('Error details:', err.response?.data);
        console.error('Error status:', err.response?.status);

        error.value = 'Error saving service. Please try again.';

        // Emit save event with error information
        emit('save', {
          success: false,
          error: error.value,
          originalError: err.message
        });
      } finally {
        loading.value = false;
      }
    };

    // Cancel editing
    const cancelEdit = () => {
      emit('cancel');
    };

    return {
      t,
      isEditing,
      title,
      description,
      currency,
      priceFrom,
      priceTo,
      category,
      loading,
      error,
      isValid,
      saveService,
      cancelEdit
    };
  }
};
</script>

<template>
  <div class="service-form">
    <h2 class="form-title">
      {{ isEditing ? t('services.editService') : t('services.addService') }}
    </h2>

    <form @submit.prevent="saveService">
      <!-- Title -->
      <div class="form-group">
        <label for="serviceTitle">{{ t('services.serviceTitle') }}*</label>
        <input
            type="text"
            id="serviceTitle"
            v-model="title"
            :placeholder="t('services.serviceTitle')"
            required
        />
      </div>

      <!-- Description -->
      <div class="form-group">
        <label for="description">{{ t('services.description') }}*</label>
        <textarea
            id="description"
            v-model="description"
            :placeholder="t('services.description')"
            rows="4"
            required
        ></textarea>
      </div>

      <!-- Category -->
      <div class="form-group">
        <label for="category">{{ t('services.category') }}</label>
        <input
            type="text"
            id="category"
            v-model="category"
            :placeholder="t('services.category')"
        />
      </div>

      <!-- Range Prices -->
      <div class="form-group price-group">
        <label>{{ t('services.priceRange') }}*</label>
        <div class="price-inputs">
          <div class="currency-select">
            <select v-model="currency">
              <option value="S/">S/</option>
              <option value="$">$</option>
              <option value="€">€</option>
            </select>
          </div>

          <div class="price-range">
            <div class="price-from">
              <label for="priceFrom">{{ t('services.from') }}*</label>
              <input
                  type="number"
                  id="priceFrom"
                  v-model.number="priceFrom"
                  min="0"
                  required
              />
            </div>

            <div class="price-to">
              <label for="priceTo">{{ t('services.to') }}*</label>
              <input
                  type="number"
                  id="priceTo"
                  v-model.number="priceTo"
                  min="0"
                  required
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Error message -->
      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <!-- Buttons -->
      <div class="form-actions">
        <button
            type="button"
            class="cancel-button"
            @click="cancelEdit"
        >
          {{ t('services.cancel') }}
        </button>
        <button
            type="submit"
            class="save-button"
            :disabled="!isValid || loading"
        >
          {{ loading ? '...' : t('services.save') }}
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.service-form {
  width: 100%;
}

.form-title {
  font-size: 20px;
  color: #333;
  margin-top: 0;
  margin-bottom: 20px;
  font-weight: 600;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

input, textarea, select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  font-family: inherit;
}

textarea {
  resize: vertical;
  min-height: 100px;
}

.price-group {
  margin-bottom: 25px;
}

.price-inputs {
  display: flex;
  gap: 15px;
}

.currency-select {
  width: 80px;
}

.price-range {
  flex: 1;
  display: flex;
  gap: 15px;
}

.price-from, .price-to {
  flex: 1;
}

.error-message {
  color: #d9534f;
  margin-bottom: 15px;
  font-size: 14px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 20px;
}

.cancel-button, .save-button {
  padding: 10px 20px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-button {
  background-color: #f0f0f0;
  color: #333;
  border: 1px solid #ddd;
}

.save-button {
  background-color: #4ed8c7;
  color: white;
  border: 1px solid #4ed8c7;
}

.cancel-button:hover {
  background-color: #e0e0e0;
}

.save-button:hover:not(:disabled) {
  background-color: #3cc0af;
}

.save-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .price-inputs {
    flex-direction: column;
    gap: 10px;
  }

  .currency-select {
    width: 100%;
  }
}
</style>