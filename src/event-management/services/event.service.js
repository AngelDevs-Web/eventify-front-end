import axios from 'axios';

const API_URL = 'http://localhost:5247';

const EventService = {
    /**
     * Get all events
     * @param {Object} params - Optional parameters for filtering
     * @returns {Promise} Promise with the event data
     */
    getEvents(params = {}) {
      // return axios.get(`${API_URL}/events`, { params });
        return axios.get(`${API_URL}/social-events`, {})
    },

    /**
     * Get a specific event by its ID
     * @param {Number|String} id - Event ID
     * @returns {Promise} Promise with the event data
     */
    getEventById(id) {
        return axios.get(`${API_URL}/social-events/${id}`);
    },

    /**
     * Create a new event
     * @param {Object} eventData - Data for the new event
     * @returns {Promise} Promise with the response
     */
    createEvent(eventData) {
        //return axios.post(`${API_URL}/events`, eventData);
        return axios.post(`${API_URL}/social-events`, eventData);
    },

    /**
     * Update an existing event
     * @param {Number|String} id - ID of the event to update
     * @param {Object} eventData - New data for the event
     * @returns {Promise} Promise with the response
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
        return axios.delete(`${API_URL}/social-events/${id}`);
    },

    /**
     *
     * Delete multiple events
     * @param {Array} ids - Array of event IDs to delete
     * @returns {Promise} Promise with all operations
     */
    deleteMultipleEvents(ids) {
        // Crear un array de  para eliminar cada evento
        const deletePromises = ids.map(id => this.deleteEvent(id));
        return Promise.all(deletePromises);
    },

    getEventByCustomerName(customerName) {
        return axios.get(`${API_URL}/social-events/${customerName}`);
    }
};

export default EventService;