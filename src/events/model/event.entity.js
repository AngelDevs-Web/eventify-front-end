export class Event {
    constructor({ id, title, description, startDate, endDate, location, status }) {
        this.id = id
        this.title = title
        this.description = description
        this.startDate = startDate
        this.endDate = endDate
        this.location = location
        this.status = status
    }
}