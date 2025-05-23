// src/profile-management/model/user.entity.js

/**
 * Entidad Usuario dentro del Bounded Context de perfil de usuario
 */
export class User {
    constructor({
                    id = '',
                    nombre = '',
                    apellido = '',
                    titulo = '',
                    avatarUrl = '',
                    email = '',
                    telefono = '',
                    ubicacion = '',
                    sitioWeb = '',
                    biografia = ''
                } = {}) {
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.titulo = titulo;
        this.avatarUrl = avatarUrl;
        this.email = email;
        this.telefono = telefono;
        this.ubicacion = ubicacion;
        this.sitioWeb = sitioWeb;
        this.biografia = biografia;
    }

    get nombreCompleto() {
        return `${this.nombre} ${this.apellido}`;
    }

    toJSON() {
        return {
            id: this.id,
            nombre: this.nombre,
            apellido: this.apellido,
            titulo: this.titulo,
            avatarUrl: this.avatarUrl,
            email: this.email,
            telefono: this.telefono,
            ubicacion: this.ubicacion,
            sitioWeb: this.sitioWeb,
            biografia: this.biografia
        };
    }

    static fromJSON(json) {
        return new User(json);
    }
}