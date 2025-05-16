// src/task-management/model/task-board-api.entity.js

import { apiService } from '../services/task.service.js';
import { TaskColumn } from './task-column.entity.js';
import { Task } from './task.entity.js';

/**
 * Clase que representa el tablero completo de tareas
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
            // Cargar datos del tablero desde la API
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
            // Si hay un error, devolver un tablero por defecto
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

            // Crear la tarea en la API
            const newTaskData = {
                columnId,
                title,
                description,
                order: column.taskCount + 1,
                createdAt: new Date().toISOString()
            };

            const response = await apiService.createTask(newTaskData);
            const createdTaskData = response.data;

            // Crear instancia de Task con los datos devueltos
            const newTask = new Task(
                createdTaskData.id,
                createdTaskData.title,
                createdTaskData.description,
                new Date(createdTaskData.createdAt)
            );

            // Actualizar el modelo local
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

            // Mover en la API
            await apiService.moveTask(taskId, sourceColumnId, targetColumnId);

            // Actualizar modelo local
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

            // Obtener datos actuales de la tarea
            const taskResponse = await apiService.getTask(taskId);
            const currentTaskData = taskResponse.data;

            // Actualizar en la API
            const updatedResponse = await apiService.updateTask(taskId, {
                ...currentTaskData,
                ...data
            });

            // Actualizar el modelo local
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

            // Eliminar de la API
            await apiService.deleteTask(taskId);

            // Eliminar del modelo local
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