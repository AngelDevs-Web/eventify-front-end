// src/profile-management/model/profile.entity.js

/**
 * Profile Entity
 */
export class profile {
    constructor({
                    id = '',
                    name = '',
                    lastName = '',
                    title = '',
                    avatarUrl = '',
                    email = '',
                    phone = '',
                    location = '',
                    webSite = '',
                    biography = ''
                } = {}) {
        this.id = id;
        this.name = name;
        this.lastName = lastName;
        this.title = title;
        this.avatarUrl = avatarUrl;
        this.email = email;
        this.phone = phone;
        this.location = location;
        this.webSite = webSite;
        this.biography = biography;
    }

    get fullName() {
        return `${this.name} ${this.lastName}`;
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            lastName: this.lastName,
            title: this.title,
            avatarUrl: this.avatarUrl,
            email: this.email,
            phone: this.phone,
            location: this.location,
            webSite: this.webSite,
            biography: this.biography
        };
    }

    static fromJSON(json) {
        return new profile(json);
    }
}