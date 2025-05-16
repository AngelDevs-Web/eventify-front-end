// src/services/task.service.js
import axios from 'axios';

// Usamos la variable de entorno para la URL base de la API
const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

/**
 * Servicio para interactuar con la API de json-server
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

    // ===== Operaciones complejas =====

    /**
     * Mover una tarea entre columnas
     * @param {number} taskId - ID de la tarea a mover
     * @param {number} sourceColumnId - ID de la columna origen
     * @param {number} targetColumnId - ID de la columna destino
     */
    moveTask: async (taskId, sourceColumnId, targetColumnId) => {
        try {
            // Obtener la tarea actual
            const taskResponse = await apiService.getTask(taskId);
            const task = taskResponse.data;

            // Obtener las tareas en la columna destino para determinar el nuevo orden
            const tasksInTargetResponse = await apiService.getColumnTasks(targetColumnId);
            const tasksInTarget = tasksInTargetResponse.data;

            // Actualizar la tarea con la nueva columna y orden
            return await apiService.updateTask(taskId, {
                ...task,
                columnId: targetColumnId,
                order: tasksInTarget.length + 1 // Agregamos al final de la columna
            });
        } catch (error) {
            console.error('Error al mover la tarea:', error);
            throw error;
        }
    },

    /**
     * Cargar un tablero completo con sus columnas y tareas
     * @param {number} boardId - ID del tablero a cargar
     * @returns {Promise<Object>} - Tablero con columnas y tareas
     */
    loadBoard: async (boardId) => {
        try {
            // 1. Obtener información del tablero
            const boardResponse = await apiService.getBoard(boardId);
            const board = boardResponse.data;

            // 2. Obtener columnas del tablero
            const columnsResponse = await apiService.getBoardColumns(boardId);
            const columns = columnsResponse.data;

            // 3. Para cada columna, obtener sus tareas
            const columnsWithTasks = await Promise.all(
                columns.map(async (column) => {
                    const tasksResponse = await apiService.getColumnTasks(column.id);
                    return {
                        ...column,
                        tasks: tasksResponse.data
                    };
                })
            );

            // 4. Retornar el tablero completo con columnas y tareas
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