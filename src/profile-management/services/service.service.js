import { Service } from '../model/service.entity';

class ServiceService {
    constructor() {
        this.baseUrl = 'http://localhost:3000';
    }

    /**
     * Gets all services for a user
     * @param {number} userId - User ID
     * @returns {Promise<Service[]>} List of services
     */
    async getServicesByUserId(userId) {
        try {
            console.log(`Fetching services for user ${userId}...`);

            const response = await fetch(`${this.baseUrl}/services?userId=${userId}`);

            if (!response.ok) {
                throw new Error(`Error fetching services: ${response.status}`);
            }

            const data = await response.json();
            console.log('Raw services data:', data); // Log raw data for debugging

            // Ensure we have an array of services
            if (!Array.isArray(data)) {
                console.error('API returned non-array response:', data);
                return [];
            }

            // Map each service with explicit ID handling
            const services = data.map(serviceData => {
                // Ensure the ID is correctly assigned
                if (!serviceData.id && serviceData.id !== 0) {
                    console.warn('Service without ID found:', serviceData);
                }

                try {
                    return Service.fromDTO(serviceData);
                } catch (err) {
                    console.error('Error creating Service from DTO:', err, serviceData);
                    // Return a basic service object if conversion fails
                    return {
                        id: serviceData.id || null,
                        title: serviceData.title || 'Unknown service',
                        description: serviceData.description || '',
                        userId: serviceData.userId || userId,
                        ...serviceData
                    };
                }
            });

            console.log(`Processed ${services.length} services for user ${userId}`);
            return services;
        } catch (error) {
            console.error('Error in getServicesByUserId:', error);
            throw error;
        }
    }

    /**
     * Creates a new service
     * @param {Service} service - Service to create
     * @returns {Promise<Service>} Created service
     */
    async createService(service) {
        try {
            console.log('Creating new service...', service);

            // Validate required fields
            if (!service.title || !service.description || service.priceFrom === undefined) {
                throw new Error('Missing required fields for service creation');
            }

            // Log what we're sending to the API
            const serviceDTO = service.toDTO ? service.toDTO() : service;
            console.log('Service DTO being sent:', serviceDTO);

            const response = await fetch(`${this.baseUrl}/services`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(serviceDTO)
            });

            if (!response.ok) {
                throw new Error(`Error creating service: ${response.status}`);
            }

            const data = await response.json();
            console.log('Service created API response:', data);

            // Verify ID was assigned
            if (!data.id && data.id !== 0) {
                console.warn('Created service has no ID from API:', data);
                // If backend doesn't assign ID, we can assign a temporary one
                // (note: this is just a workaround - backend should really assign proper IDs)
                data.id = Date.now(); // Use timestamp as temporary ID
            }

            const createdService = Service.fromDTO ? Service.fromDTO(data) : data;
            console.log('Final created service with ID:', createdService);
            return createdService;
        } catch (error) {
            console.error('Error in createService:', error);
            throw error;
        }
    }

    // Other methods remain the same...
}

export const serviceService = new ServiceService();
export default serviceService;