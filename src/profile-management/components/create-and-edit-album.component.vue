<!-- create-and-edit-album.component.vue -->
<script>
export default {
  name: 'AlbumFormComponent',
  props: {
    // If an albumId is provided, we are in edit mode
    albumId: {
      type: [Number, String],
      default: null
    },
    userId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      formLoading: false,
      formError: null,
      isSaving: false,
      albumData: {
        title: '',
        date: this.formatDateForInput(new Date()),
        eventId: '',
        description: '',
        visibility: 'public',
        photos: []
      },
      existingPhotos: [],
      photosToDelete: [],
      selectedFiles: [],
      events: []
    };
  },
  computed: {
    isEditMode() {
      return !!this.albumId;
    },
    isFormValid() {
      return this.albumData.title.trim() !== '' &&
          this.albumData.date !== '' &&
          (this.selectedFiles.length > 0 || this.existingPhotos.length > 0);
    },
    apiUrl() {
      return 'http://localhost:3000';
    }
  },
  created() {
    this.loadInitialData();
  },
  methods: {
    async loadInitialData() {
      this.formLoading = true;
      this.formError = null;

      try {
        await this.loadEvents();
        if (this.isEditMode) {
          await this.loadAlbumData();
        }

        this.formLoading = false;
      } catch (error) {
        console.error('Error loading initial data:', error);
        this.formError = 'Failed to load form data. Please try again.';
        this.formLoading = false;
      }
    },
    reloadData() {
      this.loadInitialData();
    },
    formatDateForInput(date) {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
    async loadEvents() {
      try {
        const response = await fetch(`${this.apiUrl}/events?userId=${this.userId}`);
        if (response.ok) {
          this.events = await response.json();
          return;
        }
      } catch (error) {
        console.error('Error loading events:', error);
      }

      this.events = [
        { id: 1, title: 'Wedding Event' },
        { id: 2, title: 'Corporate Conference' },
        { id: 3, title: 'Birthday Party' },
        { id: 4, title: 'Graduation Ceremony' }
      ];
    },
    async loadAlbumData() {
      if (!this.albumId) return;

      try {
        const response = await fetch(`${this.apiUrl}/albums/${this.albumId}`);
        if (!response.ok) {
          throw new Error(`Error fetching album: ${response.status}`);
        }

        const albumData = await response.json();
        this.albumData = {
          title: albumData.title || '',
          date: this.formatDateForInput(albumData.date) || this.formatDateForInput(new Date()),
          eventId: albumData.eventId || '',
          description: albumData.description || '',
          visibility: albumData.visibility || 'public'
        };

        if (albumData.photos && albumData.photos.length > 0) {
          this.existingPhotos = [...albumData.photos];
        }
      } catch (error) {
        console.error('Error loading album data:', error);
        throw error;
      }
    },
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    handleFileSelect(event) {
      const newFiles = Array.from(event.target.files);
      this.addFiles(newFiles);
    },
    handleFileDrop(event) {
      const newFiles = Array.from(event.dataTransfer.files).filter(file => file.type.startsWith('image/'));
      this.addFiles(newFiles);
    },
    addFiles(newFiles) {
      const validFiles = newFiles.filter(file =>
          file.type.startsWith('image/') && file.size <= 10 * 1024 * 1024
      );

      const totalCurrentPhotos = this.selectedFiles.length + this.existingPhotos.length;
      const availableSlots = 10 - totalCurrentPhotos;
      const filesToAdd = validFiles.slice(0, availableSlots);

      this.selectedFiles = [...this.selectedFiles, ...filesToAdd];
    },
    removePhoto(index) {
      this.selectedFiles.splice(index, 1);
    },
    removeExistingPhoto(index) {
      const photoToRemove = this.existingPhotos[index];
      if (photoToRemove.id) {
        this.photosToDelete.push(photoToRemove.id);
      }
      this.existingPhotos.splice(index, 1);
    },
    getPreviewUrl(file) {
      return URL.createObjectURL(file);
    },
    getPhotoInitials(title) {
      if (!title) return '+';
      return title.substring(0, 2).toUpperCase();
    },
    truncateText(text, maxLength) {
      if (!text) return '';
      return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    },
    async saveAlbum() {
      if (!this.isFormValid) return;

      this.isSaving = true;
      try {
        let savedAlbumId;
        const albumData = {
          userId: this.userId,
          title: this.albumData.title,
          description: this.albumData.description,
          date: this.albumData.date,
          eventId: this.albumData.eventId || null,
          visibility: this.albumData.visibility
        };

        if (this.isEditMode) {
          const response = await fetch(`${this.apiUrl}/albums/${this.albumId}`, {
            method: 'GET'
          });

          if (!response.ok) {
            throw new Error(`Error fetching album: ${response.status}`);
          }

          const currentAlbum = await response.json();

          const remainingPhotos = currentAlbum.photos.filter(
              photo => !this.photosToDelete.includes(photo.id)
          );

          // Add new photos (simulated - in a real app you would upload the files)
          const newPhotos = this.selectedFiles.map((file, index) => {
            // Generate a unique ID for each new photo
            const newId = Math.max(0, ...remainingPhotos.map(p => p.id)) + index + 1;
            return {
              id: newId,
              title: file.name.split('.')[0] || `Photo ${newId}`,
              description: '',
              url: `photo-${newId}.jpg`, // URL simulada
              uploadDate: new Date().toISOString().split('T')[0]
            };
          });

          albumData.photos = [...remainingPhotos, ...newPhotos];

          await fetch(`${this.apiUrl}/albums/${this.albumId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(albumData)
          });

          savedAlbumId = this.albumId;
        } else {
          // Create a new album
          // Add photos (simulated - in a real app you would upload the files)
          albumData.photos = this.selectedFiles.map((file, index) => {
            return {
              id: index + 1,
              title: file.name.split('.')[0] || `Photo ${index + 1}`,
              description: '',
              url: `photo-${index + 1}.jpg`, // URL simulada
              uploadDate: new Date().toISOString().split('T')[0]
            };
          });

          const response = await fetch(`${this.apiUrl}/albums`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(albumData)
          });

          const newAlbum = await response.json();
          savedAlbumId = newAlbum.id;
        }

        await new Promise(resolve => setTimeout(resolve, 500));

        this.$emit('album-saved', { success: true, albumId: savedAlbumId });
      } catch (error) {
        console.error('Error saving album:', error);
        this.$emit('album-saved', { success: false, error: 'Failed to save album. Please try again.' });
      } finally {
        this.isSaving = false;
      }
    },
    cancelForm() {
      this.selectedFiles.forEach(file => {
        if (file.previewUrl) {
          URL.revokeObjectURL(file.previewUrl);
        }
      });

      this.$emit('cancel');
    }
  }
}
</script>
<template>
  <div class="album-form-wrapper">
    <h1 class="form-title">{{ isEditMode ? 'Editar Álbum' : 'Crear Nuevo Álbum' }}</h1>

    <div v-if="formLoading" class="loading-overlay">
      <div class="loading-spinner"></div>
      <p>{{ isEditMode ? 'Cargando datos del álbum...' : 'Preparando formulario...' }}</p>
    </div>

    <div v-else-if="formError" class="error-message">
      <p>{{ formError }}</p>
      <button @click="reloadData" class="retry-button">Retry</button>
    </div>

    <div v-else class="form-container">
      <div class="album-details-section">
        <h2 class="section-title">Album Details</h2>

        <div class="form-grid">
          <!-- Name of album -->
          <div class="form-group">
            <label for="albumName">Album name <span class="required">*</span></label>
            <input
                type="text"
                id="albumName"
                v-model="albumData.title"
                class="form-control"
                placeholder="Enter album name"
                required
            />
          </div>

          <!-- event throw -->
          <div class="form-group">
            <label for="eventDate">Date of the event <span class="required">*</span></label>
            <input
                type="date"
                id="eventDate"
                v-model="albumData.date"
                class="form-control"
                required
            />
          </div>

          <!-- Associated event -->
          <div class="form-group">
            <label for="associatedEvent">Associated event</label>
            <select id="associatedEvent" class="form-control" v-model="albumData.eventId">
              <option value="">Select event</option>
              <option v-for="event in events" :key="event.id" :value="event.id">
                {{ event.title }}
              </option>
            </select>
          </div>

          <!-- Visibility -->
          <div class="form-group">
            <label for="visibility">Visibility</label>
            <select id="visibility" class="form-control" v-model="albumData.visibility">
              <option value="public">Public</option>
              <option value="private">Private</option>
              <option value="shared">Shared</option>
            </select>
          </div>

          <!-- Description -->
          <div class="form-group full-width">
            <label for="description">Description (optional)</label>
            <textarea
                id="description"
                v-model="albumData.description"
                class="form-control"
                rows="4"
                placeholder="Briefly describe this album and the occasion it represents..."
            ></textarea>
          </div>
        </div>
      </div>

      <div class="photos-section">
        <h2 class="section-title">Add Photos</h2>
        <p class="upload-info">
          You can upload up to 10 photos per album (maximum 10MB per photo)
        </p>

        <div class="upload-area" @click="triggerFileInput" @dragover.prevent @drop.prevent="handleFileDrop">
          <div class="upload-placeholder" v-if="!selectedFiles.length && !existingPhotos.length">
            <div class="upload-icon">
              <span class="icon-text">+</span>
            </div>
            <p class="upload-text">Drag and drop photos here</p>
            <span class="upload-or">o</span>
            <button class="select-files-btn">Select files</button>
          </div>

          <div class="selected-photos" v-else>
            <!-- photos exited (mode edition) -->
            <div
                v-for="(photo, index) in existingPhotos"
                :key="'existing-' + photo.id"
                class="photo-preview existing"
            >
              <div class="photo-placeholder">
                <span>{{ getPhotoInitials(photo.title) }}</span>
              </div>
              <div class="photo-title">{{ truncateText(photo.title, 15) }}</div>
              <button class="remove-photo-btn" @click.stop="removeExistingPhoto(index)">×</button>
            </div>

            <!-- New photos selected -->
            <div
                v-for="(file, index) in selectedFiles"
                :key="'new-' + index"
                class="photo-preview"
            >
              <img :src="getPreviewUrl(file)" :alt="file.name" />
              <button class="remove-photo-btn" @click.stop="removePhoto(index)">×</button>
            </div>

            <div
                class="add-more-photos"
                v-if="selectedFiles.length + existingPhotos.length < 10"
                @click.stop="triggerFileInput"
            >
              <div class="upload-icon small">
                <span class="icon-text">+</span>
              </div>
            </div>
          </div>
        </div>

        <div class="photo-count">
          {{ selectedFiles.length + existingPhotos.length }} Photos selected
        </div>

        <!-- Hidden file input -->
        <input
            type="file"
            ref="fileInput"
            multiple
            accept="image/*"
            class="hidden-input"
            @change="handleFileSelect"
        />
      </div>

      <div class="form-actions">
        <p class="required-notice"><span class="required">*</span> Required fields</p>
        <div class="buttons-group">
          <button class="cancel-btn" @click="cancelForm" :disabled="isSaving">Cancel</button>
          <button
              class="save-btn"
              :disabled="!isFormValid || isSaving"
              @click="saveAlbum"
          >
            <span v-if="isSaving">
              <span class="saving-spinner"></span>
              {{ isEditMode ? 'Updating...' : 'Creating...' }}
            </span>
            <span v-else>
              {{ isEditMode ? 'Update Album' : 'Create Album' }}
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.album-form-wrapper {
  width: 100%;
  background-color: #f5f5f7;
  padding: 20px;
  position: relative;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.loading-spinner, .saving-spinner {
  width: 30px;
  height: 30px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #4ed8c7;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 10px;
}

.saving-spinner {
  width: 16px;
  height: 16px;
  border-width: 2px;
  display: inline-block;
  margin-right: 8px;
  vertical-align: middle;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.form-title {
  font-size: 30px;
  color: #333;
  margin-bottom: 20px;
}

.error-message {
  background-color: #fff0f0;
  border: 1px solid #ffcccc;
  border-radius: 4px;
  padding: 20px;
  text-align: center;
  color: #e53e3e;
}

.retry-button {
  margin-top: 10px;
  padding: 8px 16px;
  background-color: #4ed8c7;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.form-container {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 24px;
}

.section-title {
  font-size: 20px;
  color: #333;
  margin-bottom: 20px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group.full-width {
  grid-column: span 2;
}

label {
  display: block;
  font-size: 14px;
  color: #555;
  margin-bottom: 8px;
}

.required {
  color: #e53e3e;
}

.form-control {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.form-control:focus {
  border-color: #4ed8c7;
  outline: none;
}

textarea.form-control {
  resize: vertical;
  min-height: 100px;
}

/* Photos Section */
.photos-section {
  margin-top: 30px;
}

.upload-info {
  font-size: 14px;
  color: #666;
  margin-bottom: 15px;
}

.upload-area {
  border: 2px dashed #ccc;
  border-radius: 8px;
  padding: 40px;
  text-align: center;
  cursor: pointer;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s, border-color 0.2s;
}

.upload-area:hover {
  background-color: #f9f9fb;
  border-color: #4ed8c7;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.upload-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #f0f0f5;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
}

.upload-icon.small {
  width: 40px;
  height: 40px;
}

.icon-text {
  font-size: 30px;
  color: #4ed8c7;
}

.upload-text {
  font-size: 16px;
  color: #333;
  margin-bottom: 10px;
}

.upload-or {
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
}

.select-files-btn {
  padding: 8px 16px;
  background-color: #4ed8c7;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.select-files-btn:hover {
  background-color: #3cc0af;
}

.hidden-input {
  display: none;
}

.selected-photos {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 15px;
  width: 100%;
}

.photo-preview {
  position: relative;
  padding-top: 100%;
  border-radius: 4px;
  overflow: hidden;
}

.photo-preview img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.photo-preview.existing .photo-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #4ed8c7;
  color: white;
  font-size: 24px;
  font-weight: bold;
}

.photo-preview.existing .photo-title {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 4px 8px;
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.remove-photo-btn {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 22px;
  height: 22px;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s;
}

.remove-photo-btn:hover {
  background-color: rgba(0, 0, 0, 0.8);
}

.add-more-photos {
  border: 2px dashed #ddd;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding-top: 100%;
  position: relative;
}

.add-more-photos:hover {
  background-color: #f9f9fb;
  border-color: #4ed8c7;
}

.add-more-photos .upload-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin-bottom: 0;
}

.photo-count {
  margin-top: 15px;
  text-align: right;
  font-size: 14px;
  color: #666;
}

.form-actions {
  margin-top: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.required-notice {
  font-size: 14px;
  color: #666;
}

.buttons-group {
  display: flex;
  gap: 15px;
}

.cancel-btn {
  padding: 10px 20px;
  background-color: #f0f0f5;
  color: #666;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.cancel-btn:hover:not(:disabled) {
  background-color: #e0e0e5;
}

.cancel-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.save-btn {
  padding: 10px 20px;
  background-color: #4ed8c7;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  min-width: 150px;
}

.save-btn:hover:not(:disabled) {
  background-color: #3cc0af;
}

.save-btn:disabled {
  background-color: #a0a0a0;
  cursor: not-allowed;
}

/* Responsive */
@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-group.full-width {
    grid-column: 1;
  }

  .upload-area {
    padding: 20px;
  }

  .form-actions {
    flex-direction: column;
    gap: 15px;
  }

  .required-notice {
    margin-bottom: 10px;
  }

  .buttons-group {
    width: 100%;
  }

  .cancel-btn, .save-btn {
    flex: 1;
  }
}
</style>