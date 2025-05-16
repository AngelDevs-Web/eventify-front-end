<script>
import AlbumFormComponent from '../../profile-management/components/create-and-edit-album.component.vue';

export default {
  name: 'AlbumsPageComponent',
  components: {
    AlbumFormComponent
  },
  props: {
    userId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      loading: true,
      error: null,
      albums: [],
      sortOption: 'recent',
      apiUrl: 'http://localhost:3000',
      showAlbumForm: false,
      editAlbumId: null,
      currentPage: 1,
      itemsPerPage: 5,
      lastAddedAlbumId: null,
      selectedAlbums: [],
      showDeleteModal: false,
      deletingAlbums: false
    }
  },
  computed: {
    sortedAlbums() {
      if (!this.albums || !this.albums.length) return [];

      const albumsCopy = [...this.albums];

      switch (this.sortOption) {
        case 'recent':
          return albumsCopy.sort((a, b) => new Date(b.date) - new Date(a.date));
        case 'oldest':
          return albumsCopy.sort((a, b) => new Date(a.date) - new Date(b.date));
        case 'name-asc':
          return albumsCopy.sort((a, b) => a.title.localeCompare(b.title));
        case 'name-desc':
          return albumsCopy.sort((a, b) => b.title.localeCompare(a.title));
        case 'photos':
          return albumsCopy.sort((a, b) => b.photos.length - a.photos.length);
        default:
          return albumsCopy;
      }
    },
    // Pagination calculations
    totalPages() {
      return Math.ceil(this.sortedAlbums.length / this.itemsPerPage);
    },
    paginatedAlbums() {
      // Ensure indices are valid
      if (this.sortedAlbums.length === 0) return [];

      // Ensure currentPage is valid
      if (this.currentPage < 1) this.currentPage = 1;
      if (this.currentPage > this.totalPages && this.totalPages > 0) this.currentPage = this.totalPages;

      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = Math.min(start + this.itemsPerPage, this.sortedAlbums.length);

      // Additional safety check
      if (start >= this.sortedAlbums.length) return [];

      return this.sortedAlbums.slice(start, end);
    },
    // To display a limited range of page numbers
    displayedPageNumbers() {
      const totalPages = this.totalPages;
      const currentPage = this.currentPage;

      // If there are few pages, simply show all
      if (totalPages <= 5) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
      }

      // Calculate the range to display
      let startPage, endPage;

      if (currentPage <= 2) {
        // Near the beginning
        startPage = 2;
        endPage = Math.min(3, totalPages - 1);
      } else if (currentPage >= totalPages - 1) {
        // Near the end
        startPage = Math.max(totalPages - 2, 2);
        endPage = totalPages - 1;
      } else {
        // In the middle, show the current page and adjacent ones
        startPage = currentPage - 1;
        endPage = currentPage + 1;
      }

      // Adjust if too close to the start or end
      if (startPage === 1) startPage = 2;
      if (endPage === totalPages) endPage = totalPages - 1;

      // Create the array of pages
      return Array.from(
          { length: endPage - startPage + 1 },
          (_, i) => startPage + i
      );
    },
    // Pagination info
    paginationInfo() {
      if (this.sortedAlbums.length === 0) {
        return { from: 0, to: 0 };
      }

      // Ensure values are never negative
      const from = Math.max(1, (this.currentPage - 1) * this.itemsPerPage + 1);
      const to = Math.min(from + this.itemsPerPage - 1, this.sortedAlbums.length);

      // Additional check to avoid incorrect values
      if (from > to) {
        return { from: 0, to: 0 };
      }

      return { from, to };
    },
    // To check if all albums are selected
    isAllSelected() {
      if (!this.paginatedAlbums.length) return false;
      return this.paginatedAlbums.every(album => this.selectedAlbums.includes(album.id));
    }
  },
  watch: {
    // Reset to the first page when the sorting option changes
    sortOption() {
      this.currentPage = 1;
    },
    // Reset to the first page when the items per page changes
    itemsPerPage() {
      // Save the current page before changing
      const currentStart = (this.currentPage - 1) * this.itemsPerPage + 1;

      // Calculate the new page that would approximately maintain the same position
      const newCurrentPage = Math.max(1, Math.ceil(currentStart / this.itemsPerPage));

      // Update the current page
      this.currentPage = Math.min(newCurrentPage, Math.ceil(this.sortedAlbums.length / this.itemsPerPage));

      // Save preference in localStorage
      localStorage.setItem('albumsPerPage', this.itemsPerPage);
    }
  },
  created() {
    // Load itemsPerPage preference from localStorage
    const savedItemsPerPage = localStorage.getItem('albumsPerPage');
    if (savedItemsPerPage) {
      this.itemsPerPage = parseInt(savedItemsPerPage);
    }

    // Explicit reset of the page
    this.currentPage = 1;

    this.loadAlbums();
  },
  methods: {
    async loadAlbums() {
      this.loading = true;
      this.error = null;

      try {
        console.log(`Fetching albums for user ${this.userId}`);
        const response = await fetch(`${this.apiUrl}/albums?userId=${this.userId}`);

        if (!response.ok) {
          throw new Error(`Error fetching albums: ${response.status}`);
        }

        this.albums = await response.json();
        console.log(`Loaded ${this.albums.length} albums:`, this.albums);

        // Ensure the current page is valid after loading data
        if (this.totalPages > 0 && this.currentPage > this.totalPages) {
          this.currentPage = 1; // Reset to the first page if the current one is invalid
        }

        if (this.lastAddedAlbumId) {
          this.navigateToAlbumPage(this.lastAddedAlbumId);
          this.lastAddedAlbumId = null;
        }

        this.loading = false;
      } catch (error) {
        console.error('Error loading albums:', error);
        this.error = this.$t('albums.errorLoading');
        this.loading = false;
      }
    },
    // Navigate to the page containing a specific album
    navigateToAlbumPage(albumId) {
      const album = this.sortedAlbums.find(a => a.id === albumId);
      if (!album) return;

      const albumIndex = this.sortedAlbums.indexOf(album);
      if (albumIndex >= 0) {
        const page = Math.floor(albumIndex / this.itemsPerPage) + 1;
        this.currentPage = page;
      }
    },
    formatDate(dateString) {
      if (!dateString) return '';

      try {
        const date = new Date(dateString);
        if (isNaN(date)) return this.$t('albums.invalidDate');

        // Format based on locale
        const locale = this.$i18n.locale;
        let dateFormat = 'en-GB'; // Default format (DD/MM/YYYY)

        if (locale === 'es') {
          dateFormat = 'es-ES'; // Spanish format (DD/MM/YYYY)
        } else if (locale === 'en') {
          dateFormat = 'en-GB'; // English format (DD/MM/YYYY)
        }

        return date.toLocaleDateString(dateFormat, {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        }).replace(/\//g, '/');
      } catch (e) {
        console.error('Error formatting date:', e);
        return this.$t('albums.invalidDate');
      }
    },
    getAlbumColorClass(id) {
      // Assign different color classes based on the id
      const colorClasses = ['pink-album', 'peach-album', 'mint-album', 'lavender-album', 'blue-album'];
      return colorClasses[(id - 1) % colorClasses.length];
    },
    createNewAlbum() {
      this.editAlbumId = null;
      this.showAlbumForm = true;
    },
    editAlbum(albumId) {
      this.editAlbumId = albumId;
      this.showAlbumForm = true;
    },
    viewAlbum(albumId) {
      // In a real application, this would navigate to a detailed album view
      alert(this.$t('albums.viewAlbumFuture'));
      // For example: this.$router.push(`/profile/albums/${albumId}`);
    },
    cancelAlbumForm() {
      this.showAlbumForm = false;
      this.editAlbumId = null;
    },
    handleAlbumSaved(result) {
      if (result.success) {
        // Save the album ID to navigate to its page after reloading
        this.lastAddedAlbumId = result.albumId;

        // Reload albums to show changes
        this.loadAlbums();

        // Return to album view
        this.showAlbumForm = false;
        this.editAlbumId = null;
      } else {
        // Show error message
        alert(result.error || this.$t('albums.saveError'));
      }
    },
    // Method to navigate to a specific page with validation
    goToPage(page) {
      if (page < 1 || page > this.totalPages) return;
      this.currentPage = page;

      // Scroll to the top of the list if necessary
      this.$nextTick(() => {
        const albumsContainer = document.querySelector('.albums-grid');
        if (albumsContainer) {
          albumsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    },

    // Get URL of the first photo
    getFirstPhotoUrl(album) {
      if (!album.photos || album.photos.length === 0) {
        return null;
      }

      const firstPhoto = album.photos[0];

      // If it's an absolute URL, use it directly
      if (firstPhoto.url && (firstPhoto.url.startsWith('http') || firstPhoto.url.startsWith('/'))) {
        return firstPhoto.url;
      }

      // Otherwise, construct a simulated URL
      return `${this.apiUrl}/photos/${firstPhoto.url}`;
    },

    // Methods for selection and deletion
    isAlbumSelected(albumId) {
      return this.selectedAlbums.includes(albumId);
    },

    toggleAlbumSelection(albumId) {
      const index = this.selectedAlbums.indexOf(albumId);
      if (index === -1) {
        // Add to selected
        this.selectedAlbums.push(albumId);
      } else {
        // Remove from selected
        this.selectedAlbums.splice(index, 1);
      }
    },

    toggleSelectAll() {
      if (this.isAllSelected) {
        // If all are selected, deselect all
        this.paginatedAlbums.forEach(album => {
          const index = this.selectedAlbums.indexOf(album.id);
          if (index !== -1) {
            this.selectedAlbums.splice(index, 1);
          }
        });
      } else {
        // If not all are selected, select all
        this.paginatedAlbums.forEach(album => {
          if (!this.selectedAlbums.includes(album.id)) {
            this.selectedAlbums.push(album.id);
          }
        });
      }
    },

    confirmDeleteSelected() {
      if (this.selectedAlbums.length === 0) return;
      this.showDeleteModal = true;
    },

    async deleteSelectedAlbums() {
      if (this.selectedAlbums.length === 0 || this.deletingAlbums) return;

      this.deletingAlbums = true;

      try {
        // In a real app, this could be a batch DELETE request
        const deletePromises = this.selectedAlbums.map(albumId =>
            fetch(`${this.apiUrl}/albums/${albumId}`, {
              method: 'DELETE'
            })
        );

        await Promise.all(deletePromises);

        // Update album list
        this.selectedAlbums = [];
        this.showDeleteModal = false;
        this.loadAlbums();

        alert(this.$t('albums.deleteSuccess', { count: deletePromises.length }));
      } catch (error) {
        console.error('Error deleting albums:', error);
        alert(this.$t('albums.deleteError'));
      } finally {
        this.deletingAlbums = false;
      }
    }
  }
}
</script>

<template>
  <div class="albums-page-wrapper">
    <!-- Album creation/edit mode -->
    <album-form-component
        v-if="showAlbumForm"
        :album-id="editAlbumId"
        :user-id="userId"
        @cancel="cancelAlbumForm"
        @album-saved="handleAlbumSaved"
    />

    <!-- Album display mode -->
    <div v-else class="albums-container">
      <div class="albums-header">
        <div class="heading-section">
          <h2 class="section-title">{{ $t('albums.title') }}</h2>
          <p class="section-subtitle">{{ $t('albums.subtitle') }}</p>
        </div>
        <button class="create-album-btn" @click="createNewAlbum">{{ $t('albums.createButton') }}</button>
      </div>

      <div class="filters-container">
        <div class="sorting-options">
          <span class="sort-label">{{ $t('albums.sortBy') }}</span>
          <select v-model="sortOption" class="sort-select">
            <option value="recent">{{ $t('albums.sortRecent') }}</option>
            <option value="oldest">{{ $t('albums.sortOldest') }}</option>
            <option value="name-asc">{{ $t('albums.sortNameAsc') }}</option>
            <option value="name-desc">{{ $t('albums.sortNameDesc') }}</option>
            <option value="photos">{{ $t('albums.sortPhotos') }}</option>
          </select>
        </div>

        <!-- Albums per page selector -->
        <div class="items-per-page">
          <span class="items-label">{{ $t('albums.show') }}</span>
          <select v-model="itemsPerPage" class="items-select">
            <option :value="5">{{ $t('albums.showCount', { count: 5 }) }}</option>
            <option :value="10">{{ $t('albums.showCount', { count: 10 }) }}</option>
            <option :value="15">{{ $t('albums.showCount', { count: 15 }) }}</option>
          </select>
        </div>
      </div>

      <!-- Multi-selection bar -->
      <div v-if="albums && albums.length > 0" class="selection-bar">
        <div class="select-all-control">
          <input
              type="checkbox"
              id="select-all-albums"
              :checked="isAllSelected"
              @change="toggleSelectAll"
          />
          <label for="select-all-albums">{{ $t('albums.selectAll') }}</label>
        </div>

        <button
            v-if="selectedAlbums.length > 0"
            class="delete-selected-btn"
            @click="confirmDeleteSelected"
        >
          {{ $t('albums.deleteSelected', { count: selectedAlbums.length }) }}
        </button>
      </div>

      <!-- Loader -->
      <div v-if="loading" class="loading-indicator">
        <span>{{ $t('albums.loading') }}</span>
      </div>

      <!-- Error message -->
      <div v-else-if="error" class="error-message">
        <p>{{ error }}</p>
        <button @click="loadAlbums" class="retry-button">{{ $t('albums.retry') }}</button>
      </div>

      <!-- Empty state -->
      <div v-else-if="!albums || albums.length === 0" class="empty-state">
        <p>{{ $t('albums.empty') }}</p>
        <button class="new-album-button" @click="createNewAlbum">{{ $t('albums.createNew') }}</button>
      </div>

      <!-- Album grid -->
      <div v-else>
        <div v-if="paginatedAlbums.length === 0" class="empty-page-message">
          <p>{{ $t('albums.emptyPage') }}</p>
          <button v-if="currentPage > 1" @click="currentPage = 1" class="retry-button">
            {{ $t('albums.goToFirst') }}
          </button>
        </div>

        <div v-else class="albums-grid">
          <!-- Album Cards - Only display albums on the current page -->
          <div
              v-for="album in paginatedAlbums"
              :key="album.id"
              class="album-card"
              :class="[getAlbumColorClass(album.id), {'selected': isAlbumSelected(album.id)}]"
          >
            <!-- Checkbox for selection -->
            <div class="album-select">
              <input
                  type="checkbox"
                  :id="`album-${album.id}`"
                  :checked="isAlbumSelected(album.id)"
                  @change="toggleAlbumSelection(album.id)"
              />
            </div>

            <h3 class="album-title">{{ album.title }}</h3>
            <div class="album-meta">
              <span class="photos-count">{{ $t('albums.photosCount', { count: album.photos.length }) }} •</span>
              <span class="album-date">{{ formatDate(album.date) }}</span>
            </div>

            <!-- Album preview area with first photo -->
            <div class="album-preview">
              <img
                  v-if="getFirstPhotoUrl(album)"
                  :src="getFirstPhotoUrl(album)"
                  :alt="album.title"
                  class="album-cover-img"
              />
            </div>

            <div class="album-actions">
              <button class="edit-button" @click="editAlbum(album.id)">{{ $t('albums.edit') }}</button>
              <button class="view-button" @click="viewAlbum(album.id)">{{ $t('albums.viewAlbum') }}</button>
            </div>
          </div>
        </div>

        <!-- Pagination info -->
        <div class="pagination-info" v-if="sortedAlbums.length > 0">
          {{ $t('albums.paginationInfo', { from: paginationInfo.from, to: paginationInfo.to, total: sortedAlbums.length }) }}
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="pagination">
          <button
              class="pagination-btn"
              :disabled="currentPage === 1"
              @click="goToPage(currentPage - 1)"
          >
            {{ $t('albums.previous') }}
          </button>

          <div class="page-numbers">

            <!-- 'More pages' indicator on the left -->
            <span v-if="currentPage > 3" class="page-ellipsis">...</span>

            <!-- Numeric pages around the current one -->
            <button
                v-for="page in displayedPageNumbers"
                :key="page"
                class="page-number"
                :class="{ active: currentPage === page }"
                @click="goToPage(page)"
            >
              {{ page }}
            </button>

            <!-- 'More pages' indicator on the right -->
            <span v-if="currentPage < totalPages - 2" class="page-ellipsis">...</span>

          </div>

          <button
              class="pagination-btn"
              :disabled="currentPage === totalPages"
              @click="goToPage(currentPage + 1)"
          >
            {{ $t('albums.next') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Delete confirmation modal -->
    <div v-if="showDeleteModal" class="modal-overlay">
      <div class="delete-modal">
        <h3 class="modal-title">{{ $t('albums.confirmDeleteTitle') }}</h3>
        <p class="modal-message">
          {{ $t('albums.confirmDeleteMessage', {
          count: selectedAlbums.length,
          albums: selectedAlbums.length === 1 ? $t('albums.singularAlbum') : $t('albums.pluralAlbums')
        }) }}
        </p>
        <div class="modal-actions">
          <button class="cancel-btn" @click="showDeleteModal = false">{{ $t('albums.cancel') }}</button>
          <button
              class="delete-btn"
              @click="deleteSelectedAlbums"
              :disabled="deletingAlbums"
          >
            <span v-if="deletingAlbums">
              <span class="spinner"></span> {{ $t('albums.deleting') }}
            </span>
            <span v-else>{{ $t('albums.delete') }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.albums-page-wrapper {
  width: 100%;
}

.albums-container {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
}

.albums-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.section-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0 0 10px 0;
}

.section-subtitle {
  color: #666;
  font-size: 14px;
  margin: 0;
}

.create-album-btn {
  padding: 10px 16px;
  background-color: #374151;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.create-album-btn:hover {
  background-color: #4B5563;
}

/* Container for filters and options */
.filters-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.sorting-options, .items-per-page {
  background-color: #f5f7fa;
  padding: 10px 16px;
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
}

.sort-label, .items-label {
  color: #666;
  font-size: 14px;
  margin-right: 8px;
}

.sort-select, .items-select {
  padding: 4px 8px;
  border: none;
  background-color: transparent;
  color: #333;
  font-weight: 500;
  cursor: pointer;
}

/* Selection bar (NEW) */
.selection-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background-color: #f0f0f0;
  border-radius: 6px;
  margin-bottom: 20px;
}

.select-all-control {
  display: flex;
  align-items: center;
  gap: 8px;
}

.select-all-control input[type="checkbox"] {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.select-all-control label {
  font-size: 14px;
  color: #555;
  cursor: pointer;
}

.delete-selected-btn {
  padding: 8px 16px;
  background-color: #ef4444;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.delete-selected-btn:hover {
  background-color: #dc2626;
}

.albums-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.album-card {
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  min-height: 200px;
  position: relative;
  transition: all 0.2s ease;
}

.album-card.selected {
  border: 2px solid #4ed8c7;
  box-shadow: 0 0 0 2px rgba(78, 216, 199, 0.2);
}

.album-select {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 5;
}

.album-select input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.pink-album {
  background-color: #FEF2F2;
}

.peach-album {
  background-color: #FFF7ED;
}

.mint-album {
  background-color: #F0FDF4;
}

.lavender-album {
  background-color: #F5F3FF;
}

.blue-album {
  background-color: #EFF6FF;
}

.album-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: #333;
  padding-right: 25px;
}

.album-meta {
  font-size: 13px;
  color: #666;
  margin-bottom: 30px;
}

.album-preview {
  flex-grow: 1;
  min-height: 60px;
  border-radius: 5px;
  overflow: hidden;
  background-color: rgba(0, 0, 0, 0.03);
  margin-bottom: 15px;
}

.album-cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.album-actions {
  display: flex;
  justify-content: space-between;
  margin-top: auto;
}

.edit-button, .view-button {
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.edit-button {
  background-color: transparent;
  color: #4B5563;
}

.edit-button:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.view-button {
  background-color: #4B5563;
  color: white;
}

.view-button:hover {
  background-color: #374151;
}

.pagination-info {
  text-align: center;
  font-size: 14px;
  color: #666;
  margin: 15px 0;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 20px;
  gap: 8px;
}

.pagination-btn {
  padding: 8px 16px;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  color: #333;
  cursor: pointer;
  transition: background-color 0.2s;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
}

.pagination-btn:hover:not(:disabled) {
  background-color: #e0e0e0;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  align-items: center;
}

.page-number {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ddd;
  margin: 0 4px;
  background-color: #f5f5f5;
  color: #333;
  cursor: pointer;
  transition: all 0.2s;
  border-radius: 4px;
}

.page-number:hover {
  background-color: #e0e0e0;
}
.page-number.active {
  background-color: #4ed8c7;
  color: white;
  border-color: #4ed8c7;
}

.page-ellipsis {
  margin: 0 8px;
  color: #666;
  align-self: center;
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.delete-modal {
  width: 90%;
  max-width: 450px;
  background-color: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.modal-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-top: 0;
  margin-bottom: 16px;
}

.modal-message {
  color: #4B5563;
  margin-bottom: 24px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.cancel-btn {
  padding: 10px 16px;
  background-color: #f5f7fa;
  border: 1px solid #ddd;
  color: #4B5563;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.cancel-btn:hover {
  background-color: #e5e7eb;
}

.delete-btn {
  padding: 10px 16px;
  background-color: #ef4444;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.delete-btn:hover:not(:disabled) {
  background-color: #dc2626;
}

.delete-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 8px;
  vertical-align: middle;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-indicator, .error-message, .empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background-color: #f9f9fb;
  border-radius: 8px;
  color: #666;
  min-height: 200px;
}

.error-message {
  color: #e53e3e;
}

.empty-state {
  text-align: center;
}

.empty-page-message {
  padding: 30px;
  text-align: center;
  background-color: #f9f9fb;
  border-radius: 8px;
  color: #666;
  margin-bottom: 20px;
}

.new-album-button, .retry-button {
  margin-top: 15px;
  padding: 8px 16px;
  background-color: #4B5563;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .albums-header {
    flex-direction: column;
  }

  .create-album-btn {
    margin-top: 16px;
    align-self: flex-start;
  }

  .filters-container {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .sorting-options, .items-per-page {
    width: 100%;
  }

  .selection-bar {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .delete-selected-btn {
    width: 100%;
  }

  .albums-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }

  .pagination {
    flex-direction: column;
    gap: 10px;
  }

  .page-numbers {
    flex-wrap: wrap;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .albums-grid {
    grid-template-columns: 1fr;
  }
}
</style>