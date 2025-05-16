// src/task-management/model/task-board-api.entity.js

import { apiService } from '../services/task.service.js';
import { TaskColumn } from './task-column.entity.js';
import { Task } from './task.entity.js';

/**
 * Class representing a task board in the system.
 */
export class TaskBoardApi {
    constructor(id = null, title = '', description = '', columns = []) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.columns = columns;
    }

    static async load(boardId = 1) {
        try {
            // Update the boardId to the one passed in
            const boardData = await apiService.loadBoard(boardId);

            // Convertir columnas y tareas a nuestras clases del modelo
            const columns = boardData.columns.map(columnData => {
                const tasks = columnData.tasks.map(taskData =>
                    new Task(
                        taskData.id,
                        taskData.title,
                        taskData.description,
                        new Date(taskData.createdAt)
                    )
                );

                return new TaskColumn(columnData.id, columnData.title, tasks);
            });

            return new TaskBoardApi(
                boardData.id,
                boardData.title,
                boardData.description,
                columns
            );
        } catch (error) {
            console.error('Error cargando el tablero:', error);
            // If there's an error, return a default board
            return TaskBoardApi.createDefault();
        }
    }

    static createDefault() {
        return new TaskBoardApi(
            0,
            'Tablero por defecto',
            'Creado cuando no se puede conectar con la API',
            [
                new TaskColumn(1, 'Por hacer', []),
                new TaskColumn(2, 'En progreso', []),
                new TaskColumn(3, 'Completado', [])
            ]
        );
    }

    async createTask(title, description, columnId) {
        try {
            const column = this.findColumn(columnId);
            if (!column) return null;

            // Create the task in the API
            const newTaskData = {
                columnId,
                title,
                description,
                order: column.taskCount + 1,
                createdAt: new Date().toISOString()
            };

            const response = await apiService.createTask(newTaskData);
            const createdTaskData = response.data;

            // Create a new Task instance
            const newTask = new Task(
                createdTaskData.id,
                createdTaskData.title,
                createdTaskData.description,
                new Date(createdTaskData.createdAt)
            );

            // Update the local model
            column.addTask(newTask);
            return newTask;
        } catch (error) {
            console.error('Error creando tarea:', error);
            return null;
        }
    }

    async moveTask(taskId, sourceColumnId, targetColumnId) {
        try {
            if (sourceColumnId === targetColumnId) return true;

            const sourceColumn = this.findColumn(sourceColumnId);
            const targetColumn = this.findColumn(targetColumnId);

            if (!sourceColumn || !targetColumn) return false;

            // Move the task in the API
            await apiService.moveTask(taskId, sourceColumnId, targetColumnId);

            // Update the local model
            const task = sourceColumn.removeTask(taskId);
            if (task) {
                targetColumn.addTask(task);
                return true;
            }

            return false;
        } catch (error) {
            console.error('Error moviendo tarea:', error);
            return false;
        }
    }

    async updateTask(taskId, columnId, data) {
        try {
            const column = this.findColumn(columnId);
            if (!column) return null;

            const task = column.findTask(taskId);
            if (!task) return null;

            // Obtain the current task data from the API
            const taskResponse = await apiService.getTask(taskId);
            const currentTaskData = taskResponse.data;

            // Udate the task in the API
            const updatedResponse = await apiService.updateTask(taskId, {
                ...currentTaskData,
                ...data
            });

            // Udate the local model
            task.update(data);
            return task;
        } catch (error) {
            console.error('Error actualizando tarea:', error);
            return null;
        }
    }

    async deleteTask(taskId, columnId) {
        try {
            const column = this.findColumn(columnId);
            if (!column) return false;

            // Delete the task in the API
            await apiService.deleteTask(taskId);

            // Delete the task from the local model
            return column.removeTask(taskId) !== null;
        } catch (error) {
            console.error('Error eliminando tarea:', error);
            return false;
        }
    }

    findColumn(columnId) {
        return this.columns.find(column => column.id === columnId);
    }

    findTaskInAnyColumn(taskId) {
        for (const column of this.columns) {
            const task = column.findTask(taskId);
            if (task) {
                return { task, columnId: column.id };
            }
        }
        return null;
    }
}