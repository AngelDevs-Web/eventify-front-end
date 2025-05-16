// src/task-management/model/task.entity.js

/**
 * Class representing an individual task in the system.
 */
export class Task {
    constructor(id, title, description = '', createdAt = new Date()) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.createdAt = createdAt;
    }

    static create(id, title, description) {
        return new Task(id, title, description);
    }

    update(data) {
        if (data.title !== undefined) {
            this.title = data.title;
        }
        if (data.description !== undefined) {
            this.description = data.description;
        }
        return this;
    }
}