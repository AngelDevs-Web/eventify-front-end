// profile.service.js modificado para usar ID fijo
const API_URL = 'http://localhost:3000';

export default {
    /**
     * Obtiene todos los datos del perfil de un usuario
     * @returns {Promise} Objeto con los datos completos del perfil
     */
    async getProfileData() {
        try {
            // Usar siempre el userId 1 para garantizar que tengamos datos
            const userId = 1;

            // Log para ayudar a depurar
            console.log(`Fetching user profile with ID: ${userId}`);

            // URLs completas para verificación
            const userUrl = `${API_URL}/users/${userId}`;
            const statsUrl = `${API_URL}/statistics?userId=${userId}`;
            const certsUrl = `${API_URL}/certifications?userId=${userId}`;

            console.log('Requesting:', userUrl, statsUrl, certsUrl);

            // Realizar todas las peticiones en paralelo
            const [userResponse, statsResponse, certsResponse] = await Promise.all([
                fetch(userUrl).then(res => {
                    if (!res.ok) throw new Error(`Error fetching user: ${res.status}`);
                    return res.json();
                }),
                fetch(statsUrl).then(res => {
                    if (!res.ok) throw new Error(`Error fetching statistics: ${res.status}`);
                    return res.json();
                }),
                fetch(certsUrl).then(res => {
                    if (!res.ok) throw new Error(`Error fetching certifications: ${res.status}`);
                    return res.json();
                })
            ]);

            console.log('Responses received:',
                'User:', userResponse,
                'Stats:', statsResponse,
                'Certs:', certsResponse
            );

            // Preparar los datos para devolver
            return {
                user: userResponse,
                statistics: statsResponse.length > 0 ? statsResponse[0] : {},
                certifications: certsResponse.length > 0 ? certsResponse[0] : { list: [] }
            };
        } catch (error) {
            console.error('Error fetching profile data:', error);
            throw error;
        }
    }
};