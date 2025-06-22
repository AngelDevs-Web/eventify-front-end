import httpInstance from '../../shared/services/http.instance.js';

export class ServiceItemService {

    resourceEndpoint = import.meta.env.VITE_SERVICE_ITEMS_ENDPOINT_PATH

    getByQuoteOrderId(quoteId) {
        return httpInstance.get(`/quotes/${quoteId}${this.resourceEndpoint}`);
    }

    create(quoteId,resource) {
        return httpInstance.post(`/quotes/${quoteId}${this.resourceEndpoint}`, resource)
            .then(response => {response.data})
            .catch(error => {
                console.log("Could not create quote", error);
                throw error;
            });
    }

    update(id, resource) {
        return httpInstance.put(`${this.resourceEndpoint}/${id}`, resource);
    }

    delete(quoteId,id) {
        return httpInstance.delete(`/quotes/${quoteId}${this.resourceEndpoint}/${id}`);
    }
}