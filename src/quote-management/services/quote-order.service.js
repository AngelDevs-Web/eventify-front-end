import httpInstance from '../../shared/services/http.instance.js';

export class QuoteOrderService {

    resourceEndpoint = import.meta.env.VITE_QUOTE_ORDERS_ENDPOINT_PATH

    create(resource) {
        return httpInstance.post(this.resourceEndpoint, resource)
            .then(response => response.data)
            .catch(error => {
                console.log("Error creating quote:  ",error)
                throw error;
            });
    }

    getAll(organizerId){
        console.log(organizerId);
        console.log(`/organizers/${organizerId}${this.resourceEndpoint}`)
        return httpInstance.get(`/organizers/${organizerId}${this.resourceEndpoint}`);
    }

    update(id, resource) {
        return httpInstance.put(`${this.resourceEndpoint}/${id}`, resource)
            .then(response => response.data)
            .catch(error => {
                console.log("Error updating quote:  ",error)
                throw error;
            });
    }

    delete(id) {
        return httpInstance.delete(`${this.resourceEndpoint}/${id}`);
    }
}