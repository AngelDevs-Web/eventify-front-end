// src/profile-management/model/certification.entity.js

/**
 * Entidad Certificación dentro del Bounded Context de perfil de usuario
 */
export class Certification {
    constructor({
                    id = '',
                    nombre = '',
                    fechaObtencion = null,
                    entidadEmisora = ''
                } = {}) {
        this.id = id;
        this.nombre = nombre;
        this.fechaObtencion = fechaObtencion ? new Date(fechaObtencion) : null;
        this.entidadEmisora = entidadEmisora;
    }

    toJSON() {
        return {
            id: this.id,
            nombre: this.nombre,
            fechaObtencion: this.fechaObtencion?.toISOString(),
            entidadEmisora: this.entidadEmisora
        };
    }

    static fromJSON(json) {
        return new Certification(json);
    }
}