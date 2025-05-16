import { Review } from '../model/review.entity';

class ReviewService {
    constructor() {
        this.baseUrl = import.meta.env.VITE_API_BASE_URL;
    }

    /**
     * Obtiene todas las reseñas
     * @returns {Promise<Review[]>} Lista de reseñas
     */
    async getAllReviews() {
        try {
            const response = await fetch(`${this.baseUrl}/reviews`);

            if (!response.ok) {
                throw new Error(`Error al obtener reseñas: ${response.status}`);
            }

            const data = await response.json();
            return data.map(dto => Review.fromDTO(dto));
        } catch (error) {
            console.error('Error en getAllReviews:', error);
            throw error;
        }
    }

    /**
     * Obtiene una reseña por su ID
     * @param {number} id - ID de la reseña
     * @returns {Promise<Review>} Reseña encontrada
     */
    async getReviewById(id) {
        try {
            const response = await fetch(`${this.baseUrl}/reviews/${id}`);

            if (!response.ok) {
                throw new Error(`Error al obtener reseña ${id}: ${response.status}`);
            }

            const data = await response.json();
            return Review.fromDTO(data);
        } catch (error) {
            console.error(`Error en getReviewById(${id}):`, error);
            throw error;
        }
    }

    /**
     * Crea una nueva reseña
     * @param {Review} review - Reseña a crear
     * @returns {Promise<Review>} Reseña creada
     */
    async createReview(review) {
        try {
            const response = await fetch(`${this.baseUrl}/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(review.toDTO())
            });

            if (!response.ok) {
                throw new Error(`Error al crear reseña: ${response.status}`);
            }

            const data = await response.json();
            return Review.fromDTO(data);
        } catch (error) {
            console.error('Error en createReview:', error);
            throw error;
        }
    }

    /**
     * Actualiza una reseña existente
     * @param {Review} review - Reseña a actualizar
     * @returns {Promise<Review>} Reseña actualizada
     */
    async updateReview(review) {
        try {
            const response = await fetch(`${this.baseUrl}/reviews/${review.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(review.toDTO())
            });

            if (!response.ok) {
                throw new Error(`Error al actualizar reseña ${review.id}: ${response.status}`);
            }

            const data = await response.json();
            return Review.fromDTO(data);
        } catch (error) {
            console.error(`Error en updateReview:`, error);
            throw error;
        }
    }

    /**
     * Elimina una reseña
     * @param {number} id - ID de la reseña a eliminar
     * @returns {Promise<boolean>} true si se eliminó correctamente
     */
    async deleteReview(id) {
        try {
            const response = await fetch(`${this.baseUrl}/reviews/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error(`Error al eliminar reseña ${id}: ${response.status}`);
            }

            return true;
        } catch (error) {
            console.error(`Error en deleteReview(${id}):`, error);
            throw error;
        }
    }

    /**
     * Responde a una reseña
     * @param {number} id - ID de la reseña
     * @param {string} responseText - Texto de la respuesta
     * @returns {Promise<Review>} Reseña actualizada con respuesta
     */
    async respondToReview(id, responseText) {
        try {
            // Primero obtenemos la reseña
            const review = await this.getReviewById(id);

            // Actualizamos los campos de respuesta
            review.response = responseText;
            review.responded = true;
            review.responseDate = new Date().toISOString();

            // Guardamos los cambios
            return this.updateReview(review);
        } catch (error) {
            console.error(`Error en respondToReview(${id}):`, error);
            throw error;
        }
    }

    /**
     * Filtra reseñas por rating
     * @param {number|string} rating - Rating para filtrar (o 'all' para todos)
     * @returns {Promise<Review[]>} Reseñas filtradas
     */
    async filterReviewsByRating(rating) {
        try {
            const reviews = await this.getAllReviews();

            if (rating === 'all') {
                return reviews;
            }

            return reviews.filter(review => review.rating === Number(rating));
        } catch (error) {
            console.error(`Error en filterReviewsByRating(${rating}):`, error);
            throw error;
        }
    }

    /**
     * Ordena reseñas según criterio
     * @param {string} criteria - Criterio de ordenamiento: 'recent', 'highest', 'lowest'
     * @param {Review[]} reviews - Reseñas a ordenar
     * @returns {Review[]} Reseñas ordenadas
     */
    sortReviews(criteria, reviews) {
        const reviewsCopy = [...reviews];

        switch (criteria) {
            case 'recent':
                return reviewsCopy.sort((a, b) => new Date(b.date) - new Date(a.date));
            case 'highest':
                return reviewsCopy.sort((a, b) => b.rating - a.rating);
            case 'lowest':
                return reviewsCopy.sort((a, b) => a.rating - b.rating);
            default:
                return reviewsCopy;
        }
    }

    /**
     * Obtiene estadísticas de las reseñas
     * @returns {Promise<Object>} Estadísticas de reseñas
     */
    async getReviewStats() {
        try {
            const reviews = await this.getAllReviews();

            if (reviews.length === 0) {
                return {
                    averageRating: 0,
                    totalReviews: 0,
                    ratingDistribution: {
                        5: 0,
                        4: 0,
                        3: 0,
                        2: 0,
                        1: 0
                    }
                };
            }

            // Calcular promedio
            const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
            const averageRating = sum / reviews.length;

            // Calcular distribución
            const ratingDistribution = {
                5: 0,
                4: 0,
                3: 0,
                2: 0,
                1: 0
            };

            reviews.forEach(review => {
                ratingDistribution[review.rating]++;
            });

            return {
                averageRating,
                totalReviews: reviews.length,
                ratingDistribution
            };
        } catch (error) {
            console.error('Error en getReviewStats:', error);
            throw error;
        }
    }
}

export const reviewService = new ReviewService();
export default reviewService;