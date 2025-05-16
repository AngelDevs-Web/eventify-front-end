<template>
  <div class="statistics-section">
    <h3 class="statistics-title">{{ $t(titleKey) }}</h3>

    <!-- Statistic item with value on the right -->
    <div class="statistic-item blue-bg">
      <div class="statistic-label">{{ $t(completedEventsLabelKey) }}</div>
      <div class="statistic-value">{{ completedEvents }}</div>
    </div>

    <div class="statistic-item green-bg">
      <div class="statistic-label">{{ $t(sentQuotesLabelKey) }}</div>
      <div class="statistic-value">{{ sentQuotes }}</div>
    </div>

    <div class="statistic-item orange-bg">
      <div class="statistic-label">{{ $t(servedCustomersLabelKey) }}</div>
      <div class="statistic-value">{{ servedCustomers }}</div>
    </div>

    <div class="statistic-item red-bg">
      <div class="statistic-label">{{ $t(averageRatingLabelKey) }}</div>
      <div class="statistic-value">{{ averageRating }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StatisticsDisplay',
  props: {
    titleKey: {
      type: String,
      default: 'statistics.title'
    },
    completedEvents: {
      type: [Number, String],
      default: 0
    },
    completedEventsLabelKey: {
      type: String,
      default: 'statistics.completedEvents'
    },
    sentQuotes: {
      type: [Number, String],
      default: 0
    },
    sentQuotesLabelKey: {
      type: String,
      default: 'statistics.sentQuotes'
    },
    servedCustomers: {
      type: [Number, String],
      default: 0
    },
    servedCustomersLabelKey: {
      type: String,
      default: 'statistics.servedCustomers'
    },
    averageRating: {
      type: [Number, String],
      default: 0
    },
    averageRatingLabelKey: {
      type: String,
      default: 'statistics.averageRating'
    }
  }
}
</script>

<style scoped>
/* Base style for statistics section */
.statistics-section {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 20px;
  margin-bottom: 25px;
}

.statistics-title {
  font-size: 18px;
  color: #333;
  margin-bottom: 20px;
  font-weight: 600;
}

/* Style for each statistic element */
.statistic-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 8px;
  transition: transform 0.2s ease;
}

/* Specific background colors for each statistic */
.blue-bg {
  background-color: #f0f4ff;
}

.green-bg {
  background-color: #f0fbf8;
}

.orange-bg {
  background-color: #fff8e6;
}

.red-bg {
  background-color: #feeceb;
}

.statistic-value {
  font-size: 28px;
  font-weight: 700;
}

/* Colors for each type of value */
.blue-bg .statistic-value {
  color: #6366f1;
}

.green-bg .statistic-value {
  color: #10b981;
}

.orange-bg .statistic-value {
  color: #f59e0b;
}

.red-bg .statistic-value {
  color: #ef4444;
}

.statistic-label {
  font-size: 14px;
  color: #666;
}

/* Optional hover effect */
.statistic-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style>