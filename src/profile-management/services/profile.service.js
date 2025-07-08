// src/services/profile.service.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL;

export default {
    /**
     * Obtiene todos los datos del perfil de un usuario
     * @param {number} userId - ID del usuario
     * @returns {Promise} Objeto con los datos completos del perfil
     */
    async getProfileData(userId = 1) {
        try {
            // Realizar todas las peticiones en paralelo para mejorar el rendimiento
            const [userResponse, statsResponse, certsResponse] = await Promise.all([
                axios.get(`${API_URL}/users/${userId}`),
                axios.get(`${API_URL}/statistics?userId=${userId}`),
                axios.get(`${API_URL}/certifications?userId=${userId}`)
            ]);

            // Preparar los datos para devolver
            return {
                user: userResponse.data,
                statistics: statsResponse.data.length > 0 ? statsResponse.data[0] : {},
                certifications: certsResponse.data.length > 0 ? certsResponse.data[0] : { list: [] }
            };
        } catch (error) {
            console.error('Error fetching profile data:', error);
            throw error;
        }
    },

    /**
     * Obtiene solo los datos del usuario
     * @param {number} userId - ID del usuario
     * @returns {Promise} Datos del usuario
     */
    async getUserData(userId = 1) {
        try {
            const response = await axios.get(`${API_URL}/users/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching user data:', error);
            throw error;
        }
    },

    /**
     * Obtiene solo las estadísticas del usuario
     * @param {number} userId - ID del usuario
     * @returns {Promise} Estadísticas del usuario
     */
    async getUserStatistics(userId = 1) {
        try {
            const response = await axios.get(`${API_URL}/statistics?userId=${userId}`);
            return response.data.length > 0 ? response.data[0] : {};
        } catch (error) {
            console.error('Error fetching user statistics:', error);
            throw error;
        }
    },

    /**
     * Obtiene solo las certificaciones del usuario
     * @param {number} userId - ID del usuario
     * @returns {Promise} Certificaciones del usuario
     */
    async getUserCertifications(userId = 1) {
        try {
            const response = await axios.get(`${API_URL}/certifications?userId=${userId}`);
            return response.data.length > 0 ? response.data[0] : { list: [] };
        } catch (error) {
            console.error('Error fetching user certifications:', error);
            throw error;
        }
    },

    // ---- Métodos nuevos para la configuración del perfil ----

    /**
     * Actualiza los datos del perfil del usuario
     * @param {number} userId - ID del usuario
     * @param {Object} userData - Datos actualizados del usuario
     * @returns {Promise} Datos actualizados del usuario
     */
    async updateUserProfile(userId = 1, userData) {
        try {
            const response = await axios.put(`${API_URL}/users/${userId}`, userData);
            return response.data;
        } catch (error) {
            console.error('Error updating user profile:', error);
            throw error;
        }
    },

    /**
     * Actualiza el correo electrónico del usuario
     * @param {number} userId - ID del usuario
     * @param {Object} emailData - Datos del correo electrónico
     * @param {string} emailData.newEmail - Nuevo correo electrónico
     * @returns {Promise} Datos actualizados del usuario
     */
    async updateEmail(userId = 1, emailData) {
        try {
            // En una aplicación real, probablemente habría una verificación
            // de que el email actual es correcto antes de cambiar al nuevo
            const userData = { email: emailData.newEmail };

            const response = await axios.patch(`${API_URL}/users/${userId}`, userData);
            return response.data;
        } catch (error) {
            console.error('Error updating email:', error);
            throw error;
        }
    },

    /**
     * Actualiza la contraseña del usuario
     * @param {number} userId - ID del usuario
     * @param {Object} passwordData - Datos de la contraseña
     * @param {string} passwordData.currentPassword - Contraseña actual
     * @param {string} passwordData.newPassword - Nueva contraseña
     * @returns {Promise} Respuesta de la actualización
     */
    async updatePassword(userId = 1, passwordData) {
        try {
            // En una aplicación real, esta solicitud iría a un endpoint específico
            // para cambiar la contraseña, con verificación del password actual
            const response = await axios.post(
                `${API_URL}/users/${userId}/change-password`,
                {
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword
                }
            );

            return response.data;
        } catch (error) {
            console.error('Error updating password:', error);
            throw error;
        }
    },

    /**
     * Carga una imagen de perfil
     * @param {number} userId - ID del usuario
     * @param {File} file - Archivo de imagen
     * @returns {Promise} URL de la imagen cargada
     */
    async uploadProfileImage(userId = 1, file) {
        try {
            const formData = new FormData();
            formData.append('profileImage', file);

            const response = await axios.post(
                `${API_URL}/users/${userId}/profile-image`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            return response.data;
        } catch (error) {
            console.error('Error uploading profile image:', error);
            throw error;
        }
    }
};
