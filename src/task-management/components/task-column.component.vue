<script>
import { TaskColumn } from '../model/task-column.entity.js';
import TaskItem from './task-item.component.vue';

export default {
  name: 'TaskColumnComponent',
  components: {
    TaskItem
  },
  props: {
    column: {
      type: Object,
      required: true,
      validator: (column) => column instanceof TaskColumn || typeof column === 'object'
    }
  },
  methods: {
    onDragStart(task, event) {
      // Transferir los datos de la tarea y la columna
      event.dataTransfer.setData('taskId', task.id);
      event.dataTransfer.setData('sourceColumnId', this.column.id);
      event.dataTransfer.effectAllowed = 'move';
    },

    onDragOver(event) {
      event.preventDefault();
      event.dataTransfer.dropEffect = 'move';
    },

    onDrop(event) {
      event.preventDefault();

      // Obtener los datos transferidos
      const taskId = parseInt(event.dataTransfer.getData('taskId'));
      const sourceColumnId = parseInt(event.dataTransfer.getData('sourceColumnId'));

      // Emitir evento para mover la tarea
      this.$emit('task-drop', {
        taskId,
        sourceColumnId,
        targetColumnId: this.column.id
      });
    },

    onTaskEdit(task) {
      this.$emit('task-edit', task, this.column.id);
    },

    onTaskDelete(taskId) {
      this.$emit('task-delete', taskId, this.column.id);
    }
  }
}
</script>

<template>
  <div
      class="task-column"
      @dragover="onDragOver"
      @drop="onDrop"
  >
    <div class="column-header">
      <h2>{{ column.title }}</h2>
      <span class="task-count">{{ column.taskCount }}</span>
    </div>

    <div class="column-content">
      <template v-if="column.tasks.length > 0">
        <task-item
            v-for="task in column.tasks"
            :key="task.id"
            :task="task"
            @dragstart="onDragStart(task, $event)"
            @edit="onTaskEdit"
            @delete="onTaskDelete"
        />
      </template>

      <div v-else class="empty-column">
        <p>{{ $t('tasks.emptyColumn') }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.task-column {
  flex: 0 0 300px;
  background-color: #f5f5f5;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: 100%;
}

.column-header {
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e0e0e0;
  background-color: #fafafa;
  border-radius: 8px 8px 0 0;
}

.column-header h2 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: #3A506B;
}

.task-count {
  background-color: #3A506B;
  color: white;
  border-radius: 12px;
  padding: 2px 8px;
  font-size: 0.8rem;
}

.column-content {
  padding: 16px;
  overflow-y: auto;
  flex-grow: 1;
}

.empty-column {
  color: #888;
  text-align: center;
  padding: 20px 0;
  border: 2px dashed #e0e0e0;
  border-radius: 8px;
  margin-top: 16px;
}
</style>