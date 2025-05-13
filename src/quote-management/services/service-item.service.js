import httpInstance from '../../shared/services/http.instance.js';

export class ServiceItemService {

    resourceEndpoint = import.meta.env.VITE_SERVICE_ITEMS_ENDPOINT_PATH

    getByQuoteOrderId(quoteOrderId) {
        return httpInstance.get(`${this.resourceEndpoint}?quoteOrderId=${quoteOrderId}`);
    }

    create(resource) {
        return httpInstance.post(this.resourceEndpoint, resource);
    }

    update(id, resource) {
        return httpInstance.put(`${this.resourceEndpoint}/${id}`, resource);
    }

    delete(id) {
        return httpInstance.delete(`${this.resourceEndpoint}/${id}`);
    }
}