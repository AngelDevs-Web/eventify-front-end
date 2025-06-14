import { Review } from '../model/review.entity';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL;

class ReviewService {
    /**
     * Gets all reviews
     * @returns {Promise<Review[]>} List of reviews
     */
    async getAllReviews() {
        try {
            const response = await axios.get(`${API_URL}/reviews`);
            const data = response.data;
            // Handle both array response and object with data property
            const reviewsArray = Array.isArray(data) ? data : data.reviews || [];
            return reviewsArray.map(dto => Review.fromDTO(dto));
        } catch (error) {
            console.error('Error in getAllReviews:', error);
            throw error;
        }
    }

    /**
     * Gets a review by its ID
     * @param {number} id - Review ID
     * @returns {Promise<Review>} Found review
     */
    async getReviewById(id) {
        try {
            const response = await axios.get(`${API_URL}/reviews/${id}`);
            return Review.fromDTO(response.data);
        } catch (error) {
            console.error(`Error in getReviewById(${id}):`, error);
            throw error;
        }
    }

    /**
     * Creates a new review
     * @param {Review} review - Review to create
     * @returns {Promise<Review>} Created review
     */
    async createReview(review) {
        try {
            const response = await axios.post(`${API_URL}/reviews`, review.toDTO());
            return Review.fromDTO(response.data);
        } catch (error) {
            console.error('Error in createReview:', error);
            throw error;
        }
    }

    /**
     * Updates an existing review
     * @param {Review} review - Review to update
     * @returns {Promise<Review>} Updated review
     */
    async updateReview(review) {
        try {
            const response = await axios.put(`${API_URL}/reviews/${review.id}`, review.toDTO());
            return Review.fromDTO(response.data);
        } catch (error) {
            console.error(`Error in updateReview:`, error);
            throw error;
        }
    }

    /**
     * Updates a review partially
     * @param {number} id - Review ID
     * @param {Object} reviewData - Partial review data to update
     * @returns {Promise<Review>} Updated review
     */
    async patchReview(id, reviewData) {
        try {
            const response = await axios.patch(`${API_URL}/reviews/${id}`, reviewData);
            return Review.fromDTO(response.data);
        } catch (error) {
            console.error(`Error in patchReview:`, error);
            throw error;
        }
    }

    /**
     * Deletes a review
     * @param {number} id - ID of the review to delete
     * @returns {Promise<boolean>} true if deleted successfully
     */
    async deleteReview(id) {
        try {
            await axios.delete(`${API_URL}/reviews/${id}`);
            return true;
        } catch (error) {
            console.error(`Error in deleteReview(${id}):`, error);
            throw error;
        }
    }

    /**
     * Responds to a review
     * @param {number} id - Review ID
     * @param {string} responseText - Response text
     * @returns {Promise<Review>} Updated review with response
     */
    async respondToReview(id, responseText) {
        try {
            // First get the review
            const review = await this.getReviewById(id);

            // Update response fields
            const updatedData = {
                response: responseText,
                responded: true,
                responseDate: new Date().toISOString()
            };

            // Save changes using patch
            return await this.patchReview(id, updatedData);
        } catch (error) {
            console.error(`Error in respondToReview(${id}):`, error);
            throw error;
        }
    }

    /**
     * Filters reviews by rating
     * @param {number|string} rating - Rating to filter by (or 'all' for all)
     * @returns {Promise<Review[]>} Filtered reviews
     */
    async filterReviewsByRating(rating) {
        try {
            let url = `${API_URL}/reviews`;

            // If your API supports query parameters for filtering
            if (rating !== 'all') {
                url += `?rating=${rating}`;
            }

            const response = await axios.get(url);
            const data = response.data;
            const reviewsArray = Array.isArray(data) ? data : data.reviews || [];

            // Client-side filtering as fallback
            if (rating !== 'all') {
                return reviewsArray
                    .filter(review => review.rating === Number(rating))
                    .map(dto => Review.fromDTO(dto));
            }

            return reviewsArray.map(dto => Review.fromDTO(dto));
        } catch (error) {
            console.error(`Error in filterReviewsByRating(${rating}):`, error);
            throw error;
        }
    }

    /**
     * Sorts reviews by criteria
     * @param {string} criteria - Sort criteria: 'recent', 'highest', 'lowest'
     * @param {Review[]} reviews - Reviews to sort
     * @returns {Review[]} Sorted reviews
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
     * Gets review statistics
     * @returns {Promise<Object>} Review statistics
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

            // Calculate average
            const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
            const averageRating = sum / reviews.length;

            // Calculate distribution
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
            console.error('Error in getReviewStats:', error);
            throw error;
        }
    }
}

export const reviewService = new ReviewService();
export default reviewService;