import httpInstance from "../../shared/services/http.instance.js";

export class EventApiService {
    _resourceEndpoint = "/events";

    getAllEvents() {
        return httpInstance.get(this._resourceEndpoint);
    }
    getEventById(id) {
        return httpInstance.get(`${this._resourceEndpoint}/${id}`);
    }
    getEventByUserId(userId) {
        return httpInstance.get(`${this._resourceEndpoint}/userId=${userId}`);
    }
}