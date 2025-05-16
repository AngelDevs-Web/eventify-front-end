// src/profile-management/model/statistic.entity.js

/**
 * Entidad Estadística dentro del Bounded Context de perfil de usuario
 */
export class Statistic {
    constructor({
                    eventosCompletados = 0,
                    cotizacionesEnviadas = 0,
                    clientesAtendidos = 0,
                    valoracionPromedio = 0
                } = {}) {
        this.eventosCompletados = eventosCompletados;
        this.cotizacionesEnviadas = cotizacionesEnviadas;
        this.clientesAtendidos = clientesAtendidos;
        this.valoracionPromedio = valoracionPromedio;
    }

    toJSON() {
        return {
            eventosCompletados: this.eventosCompletados,
            cotizacionesEnviadas: this.cotizacionesEnviadas,
            clientesAtendidos: this.clientesAtendidos,
            valoracionPromedio: this.valoracionPromedio
        };
    }

    static fromJSON(json) {
        return new Statistic(json);
    }
}