// Servicio para obtener datos de perfil desde la API real
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

            const response = await fetch(`${API_URL}/profiles/${profileId}`);
            if (!response.ok) {
                throw new Error(`Error fetching profile: ${response.status}`);
            }

            const profile = await response.json();

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
    }
};