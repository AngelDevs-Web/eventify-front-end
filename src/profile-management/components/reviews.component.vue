<script>
import { Review } from '../model/review.entity';
import reviewService from '../services/review.service';
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

export default {
  name: 'ReviewsComponent',
  setup() {
    const { t } = useI18n();
    const reviews = ref([]);
    const currentPage = ref(1);
    const itemsPerPage = ref(5);
    const filterValue = ref('all');
    const sortBy = ref('recent');
    const loading = ref(false);
    const error = ref(null);

    // Calculate average review score
    const averageScore = computed(() => {
      if (reviews.value.length === 0) return 0;
      const sum = reviews.value.reduce((acc, review) => acc + review.rating, 0);
      return sum / reviews.value.length;
    });

    // Filter and sort reviews
    const filteredAndSortedReviews = computed(() => {
      let filtered = [...reviews.value];

      // Apply filter
      if (filterValue.value !== 'all') {
        filtered = filtered.filter(review => review.rating === parseInt(filterValue.value));
      }

      // Apply sorting
      filtered = reviewService.sortReviews(sortBy.value, filtered);

      // Paginate results
      const startIndex = (currentPage.value - 1) * itemsPerPage.value;
      const endIndex = startIndex + itemsPerPage.value;
      return filtered.slice(startIndex, endIndex);
    });

    // Calculate total pages
    const totalPages = computed(() => {
      const filtered = reviews.value.filter(review => {
        if (filterValue.value === 'all') return true;
        return review.rating === parseInt(filterValue.value);
      });
      return Math.ceil(filtered.length / itemsPerPage.value) || 1;
    });

    // Pages to display in pagination
    const displayedPages = computed(() => {
      const pages = [];
      const maxVisiblePages = 5;

      let startPage = Math.max(1, currentPage.value - Math.floor(maxVisiblePages / 2));
      let endPage = Math.min(totalPages.value, startPage + maxVisiblePages - 1);

      if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      return pages;
    });

    // Count reviews by star rating
    const getCountByStar = (star) => {
      return reviews.value.filter(review => review.rating === star).length;
    };

    // Calculate percentage for progress bar
    const getPercentage = (star) => {
      const count = getCountByStar(star);
      return reviews.value.length > 0 ? (count / reviews.value.length) * 100 : 0;
    };

    // Format dates
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    };

    const formatDisplayDate = (dateString) => {
      const date = new Date(dateString);
      // Format: "24th of May, 2025"
      const day = date.getDate();
      const month = date.toLocaleString('en-US', { month: 'long' });
      const year = date.getFullYear();

      // Add suffix to day
      const suffix = getDaySuffix(day);

      return `${day}${suffix} of ${month}, ${year}`;
    };

    const getDaySuffix = (day) => {
      if (day > 3 && day < 21) return 'th';
      switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    };

    // Generate initials for avatar
    const getInitials = (name) => {
      if (!name) return '';
      return name.split(' ')
          .map(part => part[0])
          .join('')
          .toUpperCase()
          .substring(0, 2);
    };

    // Generate avatar color based on name
    const getAvatarColor = (name) => {
      if (!name) return '#cccccc';

      // Generate a color based on the name
      let hash = 0;
      for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
      }

      const colors = [
        '#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5',
        '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50',
        '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800',
        '#ff5722', '#795548', '#9e9e9e', '#607d8b'
      ];

      const index = Math.abs(hash) % colors.length;
      return colors[index];
    };

    // Respond to a review
    const respondToReview = async (reviewId) => {
      try {
        // Here a modal or form would be shown to capture the response
        // For simplicity, we simulate a response
        const responseText = "Thank you for your comments. We appreciate your opinion and will work to improve our services.";

        loading.value = true;
        await reviewService.respondToReview(reviewId, responseText);

        // Update the reviews list
        await fetchReviews();
      } catch (err) {
        console.error('Error responding to review:', err);
        error.value = 'Error when responding to review';
      } finally {
        loading.value = false;
      }
    };

    // Load data from API
    const fetchReviews = async () => {
      loading.value = true;
      error.value = null;

      try {
        // Using the reviews service
        reviews.value = await reviewService.getAllReviews();
      } catch (err) {
        console.error('Error fetching reviews:', err);
        error.value = 'Failed to load reviews';
      } finally {
        loading.value = false;
      }
    };

    // On component mount
    onMounted(() => {
      fetchReviews();
    });

    return {
      t,
      reviews,
      currentPage,
      filterValue,
      sortBy,
      loading,
      error,
      averageScore,
      filteredAndSortedReviews,
      totalPages,
      displayedPages,
      getCountByStar,
      getPercentage,
      formatDate,
      formatDisplayDate,
      getInitials,
      getAvatarColor,
      respondToReview
    };
  }
};
</script>

<template>
  <div class="reviews-container">
    <!-- Loading state -->
    <div v-if="loading" class="loading-state">
      <p>{{ t('reviews.loadingReviews') }}</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="error-state">
      <p>{{ t('reviews.errorLoading') }}</p>
      <button @click="fetchReviews" class="retry-button">{{ t('reviews.retry') }}</button>
    </div>

    <!-- No reviews -->
    <div v-else-if="reviews.length === 0" class="empty-state">
      <p>{{ t('reviews.noReviews') }}</p>
    </div>

    <!-- Main content -->
    <template v-else>
      <!-- Average score section -->
      <div class="reviews-summary">
        <div class="average-score">
          <h2>{{ averageScore.toFixed(1) }}</h2>
          <p>{{ t('reviews.averageScore') }}</p>
          <p class="reviews-count">{{ t('reviews.basedOn', { count: reviews.length }) }}</p>
        </div>

        <div class="stars-distribution">
          <div v-for="star in 5" :key="star" class="star-row">
            <span>{{ 6 - star }} {{ 6 - star > 1 ? t('reviews.stars') : t('reviews.star') }}</span>
            <div class="progress-bar">
              <div class="progress" :style="{ width: getPercentage(6 - star) + '%' }"></div>
            </div>
            <span>{{ getCountByStar(6 - star) }}</span>
          </div>
        </div>

        <div class="filter-options">
          <div class="filter-group">
            <label>{{ t('reviews.filterBy') }}</label>
            <select v-model="filterValue" class="select-dropdown">
              <option value="all">{{ t('reviews.allReviews') }}</option>
              <option value="5">5 {{ t('reviews.stars') }}</option>
              <option value="4">4 {{ t('reviews.stars') }}</option>
              <option value="3">3 {{ t('reviews.stars') }}</option>
              <option value="2">2 {{ t('reviews.stars') }}</option>
              <option value="1">1 {{ t('reviews.star') }}</option>
            </select>
          </div>

          <div class="filter-group">
            <label>{{ t('reviews.sortBy') }}</label>
            <select v-model="sortBy" class="select-dropdown">
              <option value="recent">{{ t('reviews.mostRecent') }}</option>
              <option value="highest">{{ t('reviews.highestRating') }}</option>
              <option value="lowest">{{ t('reviews.lowestRating') }}</option>
            </select>
          </div>
        </div>
      </div>

      <!-- No reviews after filtering -->
      <div v-if="filteredAndSortedReviews.length === 0" class="empty-filtered-state">
        <p>{{ t('reviews.noReviewsFiltered') }}</p>
      </div>

      <!-- Reviews list -->
      <div v-else class="reviews-list">
        <div v-for="review in filteredAndSortedReviews" :key="review.id" class="review-item">
          <div class="review-header">
            <div class="reviewer-avatar" :style="{ backgroundColor: getAvatarColor(review.reviewer) }">
              {{ getInitials(review.reviewer) }}
            </div>
            <div class="review-info">
              <h3>{{ review.reviewer }}</h3>
              <p>{{ review.eventName }} - {{ formatDate(review.eventDate) }}</p>
            </div>
            <div class="review-rating">
              <div class="stars">
                <span v-for="n in 5" :key="n" class="star" :class="{ 'filled': n <= review.rating }">★</span>
              </div>
              <span class="rating-number">{{ review.rating.toFixed(1) }}</span>
            </div>
            <div class="review-date">
              {{ formatDisplayDate(review.date) }}
            </div>
          </div>

          <div class="review-content">
            <p>{{ review.content }}</p>
          </div>

          <!-- Response if exists -->
          <div v-if="review.responded && review.response" class="review-response">
            <div class="response-header">
              <div class="response-avatar" :style="{ backgroundColor: '#4ed8c7' }">
                AR
              </div>
              <div class="response-info">
                <h4>Andrea Ramirez</h4>
                <p v-if="review.responseDate">{{ formatDate(review.responseDate) }}</p>
              </div>
            </div>
            <div class="response-content">
              <p>{{ review.response }}</p>
            </div>
          </div>

          <div class="review-actions">
            <button
                class="btn-respond"
                @click="respondToReview(review.id)"
            >
              {{ review.responded ? t('reviews.respondAgain') : t('reviews.respond') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="filteredAndSortedReviews.length > 0" class="pagination">
        <p>{{ t('reviews.page', { current: currentPage, total: totalPages }) }}</p>
        <div class="pagination-controls">
          <button
              :disabled="currentPage === 1"
              @click="currentPage--"
              class="pagination-btn"
          >
            &lt;&lt;{{ t('reviews.previous') }}
          </button>

          <span v-for="page in displayedPages" :key="page"
                class="page-number"
                :class="{ 'active': currentPage === page }"
                @click="currentPage = page"
          >
            {{ page }}
          </span>

          <button
              :disabled="currentPage === totalPages"
              @click="currentPage++"
              class="pagination-btn"
          >
            {{ t('reviews.next') }}&gt;&gt;
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.reviews-container {
  padding: 20px;
  font-family: inherit;
}

.loading-state, .error-state, .empty-state, .empty-filtered-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
}

.retry-button {
  margin-top: 10px;
  padding: 8px 16px;
  background-color: #4ed8c7;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.retry-button:hover {
  background-color: #3cc0af;
}

.reviews-summary {
  display: flex;
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

}

.average-score {
  flex: 1;
  text-align: center;
  padding-right: 20px;
}

.average-score h2 {
  font-size: 48px;
  margin: 0;
  color: #4ed8c7;
  font-weight: 600;
}

.reviews-count {
  color: #6c757d;
  font-size: 14px;
}

.stars-distribution {
  flex: 2;
  padding: 0 20px;
}

.star-row {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.star-row span:first-child {
  width: 60px;
}

.star-row span:last-child {
  width: 30px;
  text-align: right;
}

.progress-bar {
  flex: 1;
  height: 12px;
  background-color: #e9ecef;
  border-radius: 4px;
  margin: 0 10px;
  overflow: hidden;
}

.progress {
  height: 100%;
  background-color: #4ed8c7;
}

.filter-options {
  flex: 1;
  padding-left: 20px;
}

.filter-group {
  margin-bottom: 15px;
}

.filter-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #333;
  font-size: 14px;
}

.select-dropdown {
  width: 100%;
  padding: 8px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  background-color: white;
  font-size: 14px;
}

.reviews-list {
  margin-bottom: 20px;
}

.review-item {
  background-color: white;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #eaeaea;
}

.review-header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.reviewer-avatar, .response-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: white;
  margin-right: 15px;
}

.review-info, .response-info {
  flex: 1;
  text-align: left;
}

.review-info h3, .response-info h4 {
  margin: 0 0 5px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.response-info h4 {
  font-size: 15px;
  color: #4ed8c7;
}

.review-info p, .response-info p {
  margin: 0;
  color: #6c757d;
  font-size: 14px;
}

.review-rating {
  margin-right: 20px;
  text-align: right;
}

.stars {
  display: inline-block;
}

.star {
  color: #e0e0e0;
  font-size: 20px;
}

.star.filled {
  color: #ffc107;
}

.rating-number {
  font-size: 18px;
  font-weight: bold;
  margin-left: 5px;
}

.review-date {
  color: #6c757d;
  font-size: 14px;
}

.review-content, .response-content {
  margin-bottom: 15px;
  font-size: 14px;
  line-height: 1.5;
  color: #333;
  text-align: justify;
}

.review-response {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 12px;
  margin: 10px 0 15px 20px;
  border-left: 3px solid #4ed8c7;
}

.response-header {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.response-content {
  margin-bottom: 0;
  color: #555;
}

.review-actions {
  text-align: right;
}

.btn-respond {
  padding: 8px 16px;
  background-color: #f8f9fa;
  border: 1px solid #ced4da;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  color: #333;
  transition: all 0.2s;
}

.btn-respond:hover {
  background-color: #4ed8c7;
  color: white;
  border-color: #4ed8c7;
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}

.pagination p {
  margin: 0;
  font-size: 14px;
  color: #6c757d;
}

.pagination-controls {
  display: flex;
  align-items: center;
}

.pagination-btn {
  padding: 6px 12px;
  background-color: #f8f9fa;
  border: 1px solid #ced4da;
  border-radius: 4px;
  cursor: pointer;
  margin: 0 5px;
  font-size: 14px;
  transition: all 0.2s;
}

.pagination-btn:hover:not(:disabled) {
  background-color: #4ed8c7;
  color: white;
  border-color: #4ed8c7;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-number {
  display: inline-block;
  width: 30px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  margin: 0 5px;
  border-radius: 4px;
  cursor: pointer;
  background-color: #f8f9fa;
  border: 1px solid #ced4da;
  font-size: 14px;
  transition: all 0.2s;
}

.page-number:hover {
  background-color: #e9ecef;
}

.page-number.active {
  background-color: #4ed8c7;
  color: white;
  border-color: #4ed8c7;
}

/* Responsive styles */
@media (max-width: 992px) {
  .reviews-summary {
    flex-direction: column;
  }

  .average-score, .stars-distribution, .filter-options {
    width: 100%;
    margin-bottom: 20px;
    padding: 0;
  }
}

@media (max-width: 768px) {
  .review-header {
    flex-wrap: wrap;
  }

  .review-date {
    width: 100%;
    text-align: left;
    margin-top: 10px;
    margin-left: 65px;
  }

  .pagination {
    flex-direction: column;
    gap: 10px;
  }
}

@media (max-width: 480px) {
  .reviews-container {
    padding: 10px;
  }

  .review-item {
    padding: 10px;
  }

  .reviewer-avatar {
    width: 40px;
    height: 40px;
    font-size: 14px;
  }

  .star {
    font-size: 16px;
  }
}
</style>