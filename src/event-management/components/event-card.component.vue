<template>
  <div class="event-card" :class="{ 'event-card-selected': selected }">
    <div class="event-header" :class="headerClass">
      <h3 class="event-title">{{ event.title }}</h3>
      <span class="event-date">{{ formattedDate }}</span>
    </div>

    <div class="event-details">
      <div class="detail-row">
        <span class="detail-label">Customer:</span>
        <span class="detail-value">{{ event.customer }}</span>
      </div>

      <div class="detail-row">
        <span class="detail-label">Place:</span>
        <span class="detail-value">{{ event.location }}</span>
      </div>

      <div class="status-row">
        <span
            class="event-status"
            :class="{
            'status-active': event.status === 'Active',
            'status-pending': event.status === 'To be confirmed',
            'status-cancelled': event.status === 'Cancelled'
          }"
        >
          {{ event.status }}
        </span>
        <button class="edit-btn" @click="$emit('edit')">Edit</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EventCard',
  props: {
    event: {
      type: Object,
      required: true
    },
    selected: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    formattedDate() {
      if (!this.event.date) return '';

      const date = new Date(this.event.date);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    },
    headerClass() {
      return {
        'header-active': this.event.status === 'Active',
        'header-pending': this.event.status === 'To be confirmed',
        'header-cancelled': this.event.status === 'Cancelled',
        'header-new': this.event.isNew // Clase para eventos nuevos
      };
    }
  }
};
</script>

<style scoped>
.event-card {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  width: 280px;
  height: 100%;
  background-color: #f9f9fb;
}

.event-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.event-card-selected {
  border: 2px solid #3a556a;
}

.event-header {
  padding: 15px;
  border-bottom: 1px solid #eee;
  background-color: #f3f4f6;
}

.header-active {
  background-color: #89eca1;
}

.header-pending {
  background-color: #fff3cd;
}

.header-cancelled {
  background-color: #fbb3b3;
}

.header-new {
  background-color: #cce5ff; /* Color para eventos nuevos */
}

.event-title {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.event-date {
  display: block;
  margin-top: 5px;
  font-size: 14px;
  color: #666;
}

.event-details {
  padding: 15px;
}

.detail-row {
  display: flex;
  margin-bottom: 10px;
}

.detail-label {
  font-weight: bold;
  width: 90px;
  color: #555;
}

.detail-value {
  flex: 1;
}

.status-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
}

.event-status {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-active {
  background-color: #d4edda;
  color: #155724;
}

.status-pending {
  background-color: #fff3cd;
  color: #856404;
}

.status-cancelled {
  background-color: #fbb3b3;
  color: #272727;
}

.edit-btn {
  background-color: transparent;
  color: #3a556a;
  border: 1px solid #3a556a;
  padding: 5px 15px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.edit-btn:hover {
  background-color: #3a556a;
  color: white;
}
</style>