// src/services/task.service.js
import axios from 'axios';

// Use Vite's environment variable for the API base URL
const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

/**
 * Service to interact with the json-server API
 */
export const apiService = {
    // ===== Tableros (Boards) =====
    getBoards: () => axios.get(`${API_URL}/boards`),
    getBoard: (id) => axios.get(`${API_URL}/boards/${id}`),
    createBoard: (board) => axios.post(`${API_URL}/boards`, board),
    updateBoard: (id, board) => axios.put(`${API_URL}/boards/${id}`, board),
    deleteBoard: (id) => axios.delete(`${API_URL}/boards/${id}`),

    // ===== Columnas =====
    getBoardColumns: (boardId) =>
        axios.get(`${API_URL}/columns?boardId=${boardId}&_sort=order&_order=asc`),
    getColumn: (id) => axios.get(`${API_URL}/columns/${id}`),
    createColumn: (column) => axios.post(`${API_URL}/columns`, column),
    updateColumn: (id, column) => axios.put(`${API_URL}/columns/${id}`, column),
    deleteColumn: (id) => axios.delete(`${API_URL}/columns/${id}`),

    // ===== Tareas =====
    getColumnTasks: (columnId) =>
        axios.get(`${API_URL}/tasks?columnId=${columnId}&_sort=order&_order=asc`),
    getTask: (id) => axios.get(`${API_URL}/tasks/${id}`),
    createTask: (task) => axios.post(`${API_URL}/tasks`, task),
    updateTask: (id, task) => axios.put(`${API_URL}/tasks/${id}`, task),
    deleteTask: (id) => axios.delete(`${API_URL}/tasks/${id}`),



    /**
     * Move a task between columns
     * @param {number} taskId - ID of the task to move
     * @param {number} sourceColumnId - ID of the source column
     * @param {number} targetColumnId - ID of the target column
     */
    moveTask: async (taskId, sourceColumnId, targetColumnId) => {
        try {
            // Get the current task
            const taskResponse = await apiService.getTask(taskId);
            const task = taskResponse.data;

            // Get the tasks in the target column to determine the new order
            const tasksInTargetResponse = await apiService.getColumnTasks(targetColumnId);
            const tasksInTarget = tasksInTargetResponse.data;

            // Update the task with the new column and order
            return await apiService.updateTask(taskId, {
                ...task,
                columnId: targetColumnId,
                order: tasksInTarget.length + 1 // Add to the end of the column
            });
        } catch (error) {
            console.error('Error al mover la tarea:', error);
            throw error;
        }
    },

    /**
     * Put together a complete board with its columns and tasks
     * @param {number} boardId - ID of the board to load
     * @returns {Promise<Object>} - Board with columns and tasks
     */
    loadBoard: async (boardId) => {
        try {
            // 1. Get the board
            const boardResponse = await apiService.getBoard(boardId);
            const board = boardResponse.data;

            // 2. Get the columns of the board
            const columnsResponse = await apiService.getBoardColumns(boardId);
            const columns = columnsResponse.data;

            // 3. For each column, get the tasks
            const columnsWithTasks = await Promise.all(
                columns.map(async (column) => {
                    const tasksResponse = await apiService.getColumnTasks(column.id);
                    return {
                        ...column,
                        tasks: tasksResponse.data
                    };
                })
            );

            // 4. Return the complete board with columns and tasks
            return {
                ...board,
                columns: columnsWithTasks
            };
        } catch (error) {
            console.error('Error cargando el tablero:', error);
            throw error;
        }
    }
};

export default apiService;