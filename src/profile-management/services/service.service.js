import { Service } from '../model/service.entity';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL;

class ServiceService {
    constructor() {
        this.baseUrl = API_URL;
    }
    /**
     * Gets all services for a profile
     * @param {number} profileId - Profile ID
     * @returns {Promise<Service[]>} List of services
     */
    async getServicesByUserId(profileId) {
        try {
            console.log(`Fetching services for profile ${profileId}...`);

            const response = await axios.get(`${API_URL}/profiles/${profileId}/service-catalogs`);
            const data = response.data;

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
                        profileId: serviceData.profileId || profileId,
                        ...serviceData
                    };
                }
            });

            console.log(`Processed ${services.length} services for profile ${profileId}`);
            return services;
        } catch (error) {
            console.error('Error in getServicesByUserId:', error);
            throw error;
        }
    }

    /**
     * Gets all services
     * @returns {Promise<Service[]>} List of all services
     */
    async getAllServices(profileId) {
        try {
            const response = await axios.get(`${API_URL}/profiles/${profileId}/service-catalogs`);
            const data = response.data;

            // Handle both array response and object with data property
            const servicesArray = Array.isArray(data) ? data : data.services || [];
            return servicesArray.map(dto => Service.fromDTO(dto));
        } catch (error) {
            console.error('Error in getAllServices:', error);
            throw error;
        }
    }

    /**
     * Gets a service by its ID
     * @param {number} id - Service ID
     * @returns {Promise<Service>} Found service
     */
    async getServiceById(profileId, id) {
        try {
            const response = await axios.get(`${API_URL}/profiles/${profileId}/service-catalogs/${id}`);
            return Service.fromDTO(response.data);
        } catch (error) {
            console.error(`Error in getServiceById(${id}):`, error);
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

            // Prepare data for JSON Server (don't send id, let JSON Server generate it)
            const serviceDTO = service.toDTO ? service.toDTO() : service;
            delete serviceDTO.id; // Remove id to let JSON Server auto-generate

            console.log('Service DTO being sent:', serviceDTO);

            const response = await axios.post(`${API_URL}/profiles/${service.profileId}/service-catalogs`, serviceDTO);
            const data = response.data;

            console.log('Service created API response:', data);

            // Verify ID was assigned
            if (!data.id && data.id !== 0) {
                console.warn('Created service has no ID from API:', data);
                // If backend doesn't assign ID, we can assign a temporary one
                data.id = Date.now(); // Use timestamp as temporary ID
            }

            const createdService = Service.fromDTO ? Service.fromDTO(data) : data;
            console.log('Final created service with ID:', createdService);
            return createdService;
        } catch (error) {
            console.error('Error in createService:', error);
            console.error('Error details:', error.response?.data);
            throw error;
        }
    }

    /**
     * Updates an existing service
     * @param {Service} service - Service to update
     * @returns {Promise<Service>} Updated service
     */
    async updateService(service) {
        try {
            const serviceDTO = service.toDTO ? service.toDTO() : service;
            const response = await axios.put(`${API_URL}/profiles/${service.profileId}/service-catalogs/${service.id}`, serviceDTO);
            return Service.fromDTO(response.data);
        } catch (error) {
            console.error(`Error in updateService:`, error);
            console.error('Error details:', error.response?.data);
            throw error;
        }
    }

    /**
     * Updates a service partially
     * @param {number} id - Service ID
     * @param {Object} serviceData - Partial service data to update
     * @returns {Promise<Service>} Updated service
     */
    async patchService(profileId, id, serviceData) {
        try {
            const response = await axios.patch(`${API_URL}/profiles/${profileId}/service-catalogs/${id}`, serviceData);
            return Service.fromDTO(response.data);
        } catch (error) {
            console.error(`Error in patchService:`, error);
            console.error('Error details:', error.response?.data);
            throw error;
        }
    }

    /**
     * Deletes a service
     * @param {number} id - ID of the service to delete
     * @returns {Promise<boolean>} true if deleted successfully
     */
    async deleteService(id, profileId) {
        try {
            console.log('Attempting to delete service with ID:', id);
            const response = await axios.delete(`${API_URL}/profiles/${profileId}/service-catalogs/${id}`);
            console.log('Delete response:', response.status);
            return true;
        } catch (error) {
            console.error(`Error in deleteService(${id}):`, error);
            console.error('Error details:', error.response?.data);
            throw error;
        }
    }

    /**
     * Filters services by criteria
     * @param {Object} filters - Filter criteria
     * @param {string} filters.category - Category to filter by
     * @param {number} filters.minPrice - Minimum price
     * @param {number} filters.maxPrice - Maximum price
     * @param {number} filters.profileId - Profile ID to filter by
     * @returns {Promise<Service[]>} Filtered services
     */
    async filterServices(filters = {}) {
        try {
            const params = new URLSearchParams();

            if (filters.category) {
                params.append('category', filters.category);
            }

            const url = `${API_URL}/profiles/${filters.profileId}/service-catalogs${params.toString() ? '?' + params.toString() : ''}`;
            const response = await axios.get(url);

            let services = Array.isArray(response.data) ? response.data : response.data.services || [];

            // Client-side filtering for price range if API doesn't support it
            if (filters.minPrice !== undefined) {
                services = services.filter(service => service.priceFrom >= filters.minPrice);
            }
            if (filters.maxPrice !== undefined) {
                services = services.filter(service => service.priceFrom <= filters.maxPrice);
            }

            return services.map(dto => Service.fromDTO(dto));
        } catch (error) {
            console.error('Error in filterServices:', error);
            throw error;
        }
    }
}

export const serviceService = new ServiceService();
export default serviceService;