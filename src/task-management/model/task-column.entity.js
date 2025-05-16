// src/task-management/model/task-column.entity.js
import { Task } from './task.entity.js';

/**
 * Clase que representa una columna de tareas en el tablero
 */
export class TaskColumn {
    constructor(id, title, tasks = []) {
        this.id = id;
        this.title = title;
        this.tasks = tasks;
    }

    static create(id, title) {
        return new TaskColumn(id, title);
    }

    addTask(task) {
        this.tasks.push(task);
        return task;
    }

    removeTask(taskId) {
        const taskIndex = this.tasks.findIndex(task => task.id === taskId);
        if (taskIndex !== -1) {
            const removedTask = this.tasks[taskIndex];
            this.tasks.splice(taskIndex, 1);
            return removedTask;
        }
        return null;
    }

    findTask(taskId) {
        return this.tasks.find(task => task.id === taskId);
    }

    updateTask(taskId, data) {
        const task = this.findTask(taskId);
        if (task) {
            return task.update(data);
        }
        return null;
    }

    get taskCount() {
        return this.tasks.length;
    }
}