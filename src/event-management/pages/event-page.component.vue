<!-- event-page.component.vue -->
<template>
  <div class="events-container">
    <div class="events-header">
      <h1>{{ $t('eventManagement.pageTitle') }}</h1>

      <div class="events-actions">
        <!-- Selection and deletion bar -->
        <div v-if="selectedEvents.length > 0" class="selection-bar">
          <label class="select-all">
            <input type="checkbox" v-model="selectAll" @change="toggleSelectAll">
            {{ $t('eventManagement.actions.selectAll') }}
          </label>
          <button
              class="delete-selected-btn"
              @click="showDeleteConfirmation = true"
          >
            {{ $t('eventManagement.actions.deleteSelected') }} ({{ selectedEvents.length }})
          </button>
        </div>

        <!-- Search and filter bar when nothing is selected -->
        <div v-else class="search-filter-bar">
          <input
              type="text"
              :placeholder="$t('eventManagement.actions.search')"
              v-model="searchQuery"
          >

          <div class="filters">
            <select v-model="selectedFilter">
              <option value="all">{{ $t('eventManagement.filters.all') }}</option>
              <option value="active">{{ $t('eventManagement.filters.active') }}</option>
              <option value="pending">{{ $t('eventManagement.filters.pending') }}</option>
              <option value="cancelled">{{ $t('eventManagement.filters.cancelled') }}</option>
            </select>

            <select v-model="selectedSort">
              <option value="recent">{{ $t('eventManagement.sort.recent') }}</option>
              <option value="oldest">{{ $t('eventManagement.sort.oldest') }}</option>
              <option value="title">{{ $t('eventManagement.sort.title') }}</option>
            </select>
          </div>

          <button class="new-event-btn" @click="navigateToCreateEvent">
            {{ $t('eventManagement.actions.newEvent') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Events list -->
    <div class="events-list">
      <div
          v-for="event in filteredEvents"
          :key="event.id"
          class="event-item"
      >
        <div class="event-checkbox">
          <input
              type="checkbox"
              :checked="isSelected(event.id)"
              @change="toggleEventSelection(event.id)"
          >
        </div>

        <!-- Here we include the event card component -->
        <event-card
            :event="event"
            :selected="isSelected(event.id)"
            @edit="navigateToEditEvent(event.id)"
        />
      </div>
    </div>

    <!-- Pagination -->
    <div class="events-pagination">
      <span>
        {{ $t('eventManagement.pagination.showing') }} {{ startItem }}-{{ endItem }}
        {{ $t('eventManagement.pagination.of') }} {{ totalEvents }}
      </span>
      <div class="pagination-controls">
        <button
            :disabled="currentPage === 1"
            @click="changePage(currentPage - 1)"
        >
          &lt;&lt; {{ $t('eventManagement.pagination.previous') }}
        </button>

        <span
            v-for="page in totalPages"
            :key="page"
            :class="{ 'active-page': page === currentPage }"
            @click="changePage(page)"
        >
          {{ page }}
        </span>

        <button
            :disabled="currentPage === totalPages"
            @click="changePage(currentPage + 1)"
        >
          {{ $t('eventManagement.pagination.next') }} &gt;&gt;
        </button>
      </div>
    </div>

    <!-- Delete confirmation modal -->
    <div v-if="showDeleteConfirmation" class="delete-confirmation-modal">
      <div class="modal-content">
        <h3>{{ $t('eventManagement.confirmation.title') }}</h3>
        <p>{{ $t('eventManagement.confirmation.message', { count: selectedEvents.length }) }}</p>
        <div class="modal-actions">
          <button @click="showDeleteConfirmation = false" class="cancel-btn">
            {{ $t('eventManagement.actions.cancel') }}
          </button>
          <button @click="deleteSelectedEvents" class="delete-btn">
            {{ $t('eventManagement.actions.delete') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import EventCard from '../components/event-card.component.vue';
import EventService from '../services/event.service.js';

export default {
  name: 'EventPage',
  components: {
    EventCard
  },
  data() {
    return {
      events: [],
      selectedEvents: [],
      selectAll: false,
      searchQuery: '',
      selectedFilter: 'all',
      selectedSort: 'recent',
      currentPage: 1,
      pageSize: 5,
      showDeleteConfirmation: false,
      loading: false,
    };
  },
  computed: {
    filteredEvents() {
      let filtered = [...this.events];

      // Filter by search query
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(event =>
            event.title.toLowerCase().includes(query) ||
            event.customerName.toLowerCase().includes(query) ||
            event.location.toLowerCase().includes(query)
        );
      }

      // Filter by status
      if (this.selectedFilter !== 'all') {
        filtered = filtered.filter(event => {
          if (this.selectedFilter === 'active') return event.status === this.$t('eventManagement.status.active');
          if (this.selectedFilter === 'pending') return event.status === this.$t('eventManagement.status.toBeConfirmed');
          if (this.selectedFilter === 'cancelled') return event.status === this.$t('eventManagement.status.cancelled');
          return true;
        });
      }

      // Sort events
      if (this.selectedSort === 'recent') {
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
      } else if (this.selectedSort === 'oldest') {
        filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
      } else if (this.selectedSort === 'title') {
        filtered.sort((a, b) => a.title.localeCompare(b.title));
      }

      // Pagination - only returns events for the current page
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;

      return filtered.slice(startIndex, endIndex);
    },
    totalEvents() {
      return this.events.length;
    },
    totalPages() {
      return Math.ceil(this.totalEvents / this.pageSize);
    },
    startItem() {
      if (this.totalEvents === 0) return 0;
      return (this.currentPage - 1) * this.pageSize + 1;
    },
    endItem() {
      if (this.totalEvents === 0) return 0;
      return Math.min(this.currentPage * this.pageSize, this.totalEvents);
    }
  },
  methods: {
    async fetchEvents() {
      this.loading = true;
      try {
        const response = await EventService.getEvents();
        this.events = response.data;
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        this.loading = false;
      }
    },
    isSelected(eventId) {
      return this.selectedEvents.includes(eventId);
    },
    toggleEventSelection(eventId) {
      const index = this.selectedEvents.indexOf(eventId);
      if (index === -1) {
        this.selectedEvents.push(eventId);
      } else {
        this.selectedEvents.splice(index, 1);
      }
      // Update "Select All" status
      this.selectAll = this.selectedEvents.length === this.events.length;
    },
    toggleSelectAll() {
      if (this.selectAll) {
        // Select all events
        this.selectedEvents = this.events.map(event => event.id);
      } else {
        // Deselect all
        this.selectedEvents = [];
      }
    },
    async deleteSelectedEvents() {
      this.loading = true;
      try {
        // Delete all selected events
        await EventService.deleteMultipleEvents(this.selectedEvents);

        // Clear selections and reload events
        this.selectedEvents = [];
        this.showDeleteConfirmation = false;
        await this.fetchEvents();
      } catch (error) {
        console.error('Error deleting events:', error);
      } finally {
        this.loading = false;
      }
    },
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
    navigateToCreateEvent() {
      this.$router.push('/events/create');
    },
    navigateToEditEvent(eventId) {
      this.$router.push(`/events/${eventId}/edit`);
    }
  },
  created() {
    this.fetchEvents();
  }
};
</script>

<style scoped>
/* Basic reset and global styles */
*, *::before, *::after {
  box-sizing: border-box;
}

.events-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  position: relative; /* Add this property */
  z-index: 1; /* Add this property to establish the stacking context */
}

.events-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.events-actions {
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: flex-start;
}

.selection-bar {
  display: flex;
  align-items: center;
  gap: 15px;
  background-color: #f5f5f5;
  padding: 10px 15px;
  border-radius: 4px;
  width: 100%;

}

.delete-selected-btn {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
}

.search-filter-bar {
  display: flex;
  gap: 10px;
  align-items: center;
  width: 100%;
}

.search-filter-bar input {
  flex-grow: 1;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.filters {
  display: flex;
  gap: 10px;
}

.filters select {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.new-event-btn {
  background-color: #3a556a;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
}

.events-list {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.event-item {
  display: flex;
  gap: 10px;
  align-items: center;
}

.event-checkbox {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
}

.events-pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}

.pagination-controls {
  display: flex;
  gap: 5px;
  align-items: center;
}

.pagination-controls button {
  padding: 5px 10px;
  border: 1px solid #ccc;
  background-color: #f5f5f5;
  cursor: pointer;
}

.pagination-controls button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-controls span {
  padding: 5px 10px;
  cursor: pointer;
}

.pagination-controls span.active-page {
  background-color: #3a556a;
  color: white;
  border-radius: 4px;
}

.delete-confirmation-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 4px;
  max-width: 500px;
  width: 90%;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.cancel-btn {
  background-color: #f5f5f5;
  border: 1px solid #ccc;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
}

.delete-btn {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
}

/* Styles for loading and empty states */
.loading-indicator {
  text-align: center;
  padding: 20px;
  font-style: italic;
  color: #666;
}

.no-events-message {
  text-align: center;
  padding: 30px;
  background-color: #f9f9f9;
  border-radius: 4px;
  color: #666;
}
</style>