import httpInstance from '../../shared/services/http.instance.js';

export class QuoteOrderService {

    resourceEndpoint = import.meta.env.VITE_QUOTE_ORDERS_ENDPOINT_PATH

    create(resource) {
        return httpInstance.post(this.resourceEndpoint, resource);
    }

    getAll(){
        return httpInstance.get(`${this.resourceEndpoint}`);
    }

    update(id, resource) {
        return httpInstance.put(`${this.resourceEndpoint}/${id}`, resource);
    }

    delete(id) {
        return httpInstance.delete(`${this.resourceEndpoint}/${id}`);
    }
}