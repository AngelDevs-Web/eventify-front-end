<script>
import TaskColumnComponent from "./task-column.component.vue";
import { TaskBoardApi } from "../model/task-board-api.entity.js";

export default {
  name: "task-board.component",
  components: {
    TaskColumnComponent
  },
  data() {
    return {
      taskBoard: null,
      loading: true,
      error: null,
      newTask: {
        title: '',
        description: '',
        columnId: 1
      },
      taskDialog: false,
      editingTask: null
    }
  },
  async created() {
    try {
      // Cargar el tablero desde la API (por defecto carga el tablero con ID 1)
      this.taskBoard = await TaskBoardApi.load();
      this.loading = false;
    } catch (error) {
      console.error('Error cargando el tablero:', error);
      this.error = 'No se pudo cargar el tablero. Por favor, inténtalo de nuevo más tarde.';
      this.loading = false;
    }
  },
  methods: {
    openNewTaskDialog() {
      // Reset del formulario
      this.newTask = {
        title: '',
        description: '',
        columnId: this.taskBoard.columns.length > 0 ? this.taskBoard.columns[0].id : 1
      };
      this.editingTask = null;
      this.taskDialog = true;
    },

    async saveTask() {
      if (!this.newTask.title.trim()) {
        return; // No permitir tareas sin título
      }

      try {
        if (this.editingTask) {
          // Actualizar tarea existente
          await this.taskBoard.updateTask(
              this.editingTask.id,
              this.newTask.columnId,
              {
                title: this.newTask.title,
                description: this.newTask.description
              }
          );
        } else {
          // Crear nueva tarea
          await this.taskBoard.createTask(
              this.newTask.title,
              this.newTask.description,
              this.newTask.columnId
          );
        }

        this.taskDialog = false;
      } catch (error) {
        console.error('Error guardando la tarea:', error);
        // Aquí podrías mostrar un mensaje de error al usuario
      }
    },

    handleTaskEdit(task, columnId) {
      this.editingTask = task;
      this.newTask = {
        title: task.title,
        description: task.description,
        columnId: columnId
      };
      this.taskDialog = true;
    },

    async handleTaskDelete(taskId, columnId) {
      if (confirm(this.$t('tasks.confirmDelete'))) {
        try {
          await this.taskBoard.deleteTask(taskId, columnId);
        } catch (error) {
          console.error('Error eliminando la tarea:', error);
          // Aquí podrías mostrar un mensaje de error al usuario
        }
      }
    },

    async handleTaskDrop({ taskId, sourceColumnId, targetColumnId }) {
      if (sourceColumnId !== targetColumnId) {
        try {
          await this.taskBoard.moveTask(taskId, sourceColumnId, targetColumnId);
        } catch (error) {
          console.error('Error moviendo la tarea:', error);
          // Aquí podrías mostrar un mensaje de error al usuario
        }
      }
    }
  }
}
</script>

<template>
  <div class="task-board p-4">
    <div class="board-header mb-4">
      <h1 class="text-2xl font-bold">{{ $t('tasks.title') }}</h1>
      <pv-button
          icon="pi pi-plus"
          :label="$t('tasks.addTask')"
          class="p-button-primary"
          @click="openNewTaskDialog"
          :disabled="loading"
      />
    </div>

    <!-- Estado de carga -->
    <div v-if="loading" class="loading-state">
      <p>Cargando tablero...</p>
    </div>

    <!-- Mensaje de error -->
    <div v-else-if="error" class="error-state">
      <p>{{ error }}</p>
      <pv-button label="Reintentar" @click="created" />
    </div>

    <!-- Tablero cargado correctamente -->
    <div v-else class="board-container">
      <task-column-component
          v-for="column in taskBoard.columns"
          :key="column.id"
          :column="column"
          @task-edit="handleTaskEdit"
          @task-delete="handleTaskDelete"
          @task-drop="handleTaskDrop"
      />
    </div>

    <!-- Diálogo para crear/editar tareas -->
    <pv-dialog
        v-model:visible="taskDialog"
        :header="editingTask ? $t('tasks.edit') : $t('tasks.create')"
        :modal="true"
        :style="{ width: '500px' }"
        class="task-dialog"
    >
      <div class="p-fluid task-dialog-content">
        <div class="field mb-4">
          <label for="task-title" class="block mb-2 font-medium">{{ $t('tasks.taskTitle') }}</label>
          <pv-input-text
              id="task-title"
              v-model="newTask.title"
              autofocus
              :class="{'p-invalid': newTask.title.trim() === ''}"
              class="w-full p-inputtext"
          />
          <small v-if="newTask.title.trim() === ''" class="p-error block mt-1">
            {{ $t('tasks.taskTitle') }} {{ $t('common.required') }}
          </small>
        </div>

        <div class="field mb-4">
          <label for="task-description" class="block mb-2 font-medium">{{ $t('tasks.taskDescription') }}</label>
          <pv-textarea
              id="task-description"
              v-model="newTask.description"
              rows="3"
              class="w-full p-inputtext"
          />
        </div>

        <div class="field mb-4">
          <label for="task-column" class="block mb-2 font-medium">{{ $t('tasks.column') }}</label>
          <pv-dropdown
              id="task-column"
              v-model="newTask.columnId"
              :options="taskBoard.columns"
              option-label="title"
              option-value="id"
              class="w-full p-inputtext"
          />
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <pv-button
              :label="$t('tasks.cancel')"
              icon="pi pi-times"
              class="p-button-text"
              @click="taskDialog = false"
          />
          <pv-button
              :label="$t('tasks.save')"
              icon="pi pi-check"
              class="p-button-primary ml-2"
              :disabled="newTask.title.trim() === ''"
              @click="saveTask"
          />
        </div>
      </template>
    </pv-dialog>
  </div>
</template>

<style scoped>
.task-board {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.board-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.board-container {
  display: flex;
  gap: 20px;
  overflow-x: auto;
  padding-bottom: 20px;
  height: calc(100vh - 160px);
  min-height: 400px;
}

/* Estados de carga y error */
.loading-state, .error-state {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 200px;
  width: 100%;
  text-align: center;
}

.error-state {
  color: #f44336;
}

/* Estilos para el diálogo de tareas */
:deep(.task-dialog) {
  padding: 0;
}

:deep(.task-dialog .p-dialog-header) {
  padding: 1.5rem 1.5rem 1rem;
}

:deep(.task-dialog .p-dialog-content) {
  padding: 0 1.5rem 1.5rem;
}

.task-dialog-content {
  padding: 1rem 0;
}

:deep(.p-inputtext) {
  padding: 0.75rem;
}

:deep(.p-dropdown) {
  height: auto;
}

:deep(.p-dropdown-label) {
  padding: 0.75rem;
}

:deep(.task-dialog .p-dialog-footer) {
  padding: 1rem 1.5rem 1.5rem;
  border-top: 1px solid #e9ecef;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}

@media (max-width: 768px) {
  .board-container {
    flex-direction: column;
    height: auto;
  }

  .task-column {
    width: 100%;
    margin-bottom: 20px;
  }
}
</style>