// Servicio para obtener datos de perfil desde la API real utilizando axios
import httpInstance from './http.instance.js';

const API_URL = import.meta.env.VITE_API_BASE_URL;

export default {
    /**
     * Obtiene todos los datos del perfil de un usuario
     * @param {number} profileId Identificador del perfil
     * @returns {Promise<Object>} Datos del perfil junto a estadísticas y certificaciones
     */
    async getProfileData(profileId = 1) {
        try {
            console.log(`Fetching profile with ID: ${profileId}`);

            const { data: profile } = await httpInstance.get(`${API_URL}/profiles/${profileId}`);

            return {
                user: {
                    name: profile.fullName,
                    email: profile.email,
                    location: profile.streetAddress,
                    title: profile.role,
                    profileImage: null
                },
                statistics: {},
                certifications: { list: [] }
            };
        } catch (error) {
            console.error('Error fetching profile data:', error);
            throw error;
        }
    }};