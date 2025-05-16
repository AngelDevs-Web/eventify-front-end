export class Review {
    constructor({
                    id = null,
                    reviewer = '',
                    eventName = '',
                    eventDate = '',
                    rating = 0,
                    content = '',
                    date = '',
                    responded = false
                } = {}) {
        this.id = id;
        this.reviewer = reviewer;
        this.eventName = eventName;
        this.eventDate = eventDate;
        this.rating = rating;
        this.content = content;
        this.date = date;
        this.responded = responded;
    }

    static fromDTO(dto) {
        return new Review({
            id: dto.id,
            reviewer: dto.reviewer,
            eventName: dto.eventName,
            eventDate: dto.eventDate,
            rating: dto.rating,
            content: dto.content,
            date: dto.date,
            responded: dto.responded
        });
    }

    toDTO() {
        return {
            id: this.id,
            reviewer: this.reviewer,
            eventName: this.eventName,
            eventDate: this.eventDate,
            rating: this.rating,
            content: this.content,
            date: this.date,
            responded: this.responded
        };
    }
}

export default Review;