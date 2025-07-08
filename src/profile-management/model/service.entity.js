export class Service {
    constructor({
                    id = null,
                    profileId = null,
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
        this.profileId = profileId;
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
            profileId: dto.profileId,
            title: dto.title,
            description: dto.description,
            priceFrom: dto.priceFrom,
            priceTo: dto.priceTo,
            // Backend does not send currency or state fields
            category: dto.category,
            // Provide default currency for UI display
            currency: 'S/'
        });
    }

    toDTO() {
        return {
            id: this.id,
            profileId: this.profileId,
            title: this.title,
            description: this.description,
            priceFrom: this.priceFrom,
            priceTo: this.priceTo,
            category: this.category
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