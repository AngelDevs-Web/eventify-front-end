export class Service {
    constructor({
                    id = null,
                    userId = null,
                    title = '',
                    description = '',
                    priceFrom = 0,
                    priceTo = 0,
                    currency = 'S/',
                    category = '',
                    isActive = true,
                    createdAt = new Date().toISOString(),
                    updatedAt = new Date().toISOString()
                } = {}) {
        this.id = id;
        this.userId = userId;
        this.title = title;
        this.description = description;
        this.priceFrom = priceFrom;
        this.priceTo = priceTo;
        this.currency = currency;
        this.category = category;
        this.isActive = isActive;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    static fromDTO(dto) {
        return new Service({
            id: dto.id,
            userId: dto.userId,
            title: dto.title,
            description: dto.description,
            priceFrom: dto.priceFrom,
            priceTo: dto.priceTo,
            currency: dto.currency,
            category: dto.category,
            isActive: dto.isActive,
            createdAt: dto.createdAt,
            updatedAt: dto.updatedAt
        });
    }

    toDTO() {
        return {
            id: this.id,
            userId: this.userId,
            title: this.title,
            description: this.description,
            priceFrom: this.priceFrom,
            priceTo: this.priceTo,
            currency: this.currency,
            category: this.category,
            isActive: this.isActive,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }

    // Helper para formato de precio
    get formattedPrice() {
        if (this.priceFrom === this.priceTo) {
            return `${this.currency} ${this.priceFrom.toLocaleString()}`;
        }
        return `${this.currency} ${this.priceFrom.toLocaleString()} - ${this.currency} ${this.priceTo.toLocaleString()}`;
    }
}

export default Service;