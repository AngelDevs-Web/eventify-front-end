// event.service.js
import axios from 'axios';

const API_URL = 'http://localhost:3000'; // Ajusta esto a la URL de tu json-server

const EventService = {
    /**
     * Obtener todos los eventos
     * @param {Object} params - Parámetros opcionales para filtrado
     * @returns {Promise} Promise con los datos de los eventos
     */
    getEvents(params = {}) {
        return axios.get(`${API_URL}/events`, { params });
    },

    /**
     * Obtener un evento específico por su ID
     * @param {Number|String} id - ID del evento
     * @returns {Promise} Promise con los datos del evento
     */
    getEventById(id) {
        return axios.get(`${API_URL}/events/${id}`);
    },

    /**
     * Crear un nuevo evento
     * @param {Object} eventData - Datos del nuevo evento
     * @returns {Promise} Promise con la respuesta
     */
    createEvent(eventData) {
        return axios.post(`${API_URL}/events`, eventData);
    },

    /**
     * Actualizar un evento existente
     * @param {Number|String} id - ID del evento a actualizar
     * @param {Object} eventData - Nuevos datos para el evento
     * @returns {Promise} Promise con la respuesta
     */
    updateEvent(id, eventData) {
        return axios.put(`${API_URL}/events/${id}`, eventData);
    },

    /**
     * Eliminar un evento
     * @param {Number|String} id - ID del evento a eliminar
     * @returns {Promise} Promise con la respuesta
     */
    deleteEvent(id) {
        return axios.delete(`${API_URL}/events/${id}`);
    },

    /**
     * Eliminar múltiples eventos
     * @param {Array} ids - Array de IDs de eventos a eliminar
     * @returns {Promise} Promise con todas las operaciones
     */
    deleteMultipleEvents(ids) {
        // Crear un array de promesas para eliminar cada evento
        const deletePromises = ids.map(id => this.deleteEvent(id));
        return Promise.all(deletePromises);
    }
};

export default EventService;