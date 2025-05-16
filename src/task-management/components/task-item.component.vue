<script>
import { Task } from '../model/task.entity.js';

export default {
  name: 'TaskItem',
  props: {
    task: {
      type: Object,
      required: true,
      validator: (task) => task instanceof Task || typeof task === 'object'
    }
  },
  data() {
    return {
      showActions: false
    }
  },
  computed: {
    // Asegurarnos de mostrar el título correctamente
    taskTitle() {
      // Acceder directamente a la propiedad title del objeto task
      return this.task && this.task.title ? this.task.title : '(Sin título)';
    },

    taskDescription() {
      return this.task && this.task.description ? this.task.description : '(Sin descripción)';
    },

    formattedDate() {
      return this.task && this.task.createdAt ?
          new Date(this.task.createdAt).toLocaleDateString() :
          new Date().toLocaleDateString();
    }
  },
  methods: {
    onEdit() {
      this.$emit('edit', this.task);
    },

    onDelete() {
      this.$emit('delete', this.task.id);
    }
  }
}
</script>

<template>
  <div
      class="task-item"
      @mouseenter="showActions = true"
      @mouseleave="showActions = false"
      draggable="true"
      @dragstart="$emit('dragstart', $event)"
  >
    <div class="task-content">
      <!-- Usar la propiedad computada para mostrar el título -->
      <h3 class="task-title" :class="{'task-missing': !task.title}">{{ taskTitle }}</h3>

      <!-- Usar la propiedad computada para mostrar la descripción -->
      <p class="task-description" :class="{'text-muted': !task.description}">{{ taskDescription }}</p>
    </div>

    <div v-show="showActions" class="task-actions">
      <pv-button
          icon="pi pi-pencil"
          class="p-button-text p-button-rounded p-button-sm"
          @click="onEdit"
      />
      <pv-button
          icon="pi pi-trash"
          class="p-button-text p-button-rounded p-button-danger p-button-sm"
          @click="onDelete"
      />
    </div>

    <div class="task-footer">
      <span class="task-date">{{ formattedDate }}</span>
    </div>
  </div>
</template>

<style scoped>
.task-item {
  background-color: white;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  position: relative;
  cursor: grab;
  transition: all 0.2s ease;
}

.task-item:hover {
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.task-title {
  margin: 0 0 8px 0;
  color: #999;
  font-size: 1rem;
  font-weight: 600;
  word-break: break-word;
}

.task-missing {
  color: #999;
  font-style: italic;
}

.task-description {
  margin: 0;
  font-size: 0.9rem;
  color: #666;
  word-break: break-word;
}

.text-muted {
  color: #999;
  font-style: italic;
}

.task-actions {
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  gap: 4px;
}

.task-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
}

.task-date {
  font-size: 0.8rem;
  color: #888;
}
</style>