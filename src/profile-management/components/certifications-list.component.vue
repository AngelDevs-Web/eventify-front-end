<template>
  <div class="certifications-container">
    <h3 class="certifications-title">{{ $t(titleKey) }}</h3>

    <div v-for="(certification, index) in certifications" :key="index" class="certification-item">
      <div class="certification-icon">
        <span class="check-mark">✓</span>
      </div>
      <div class="certification-text">{{ certification }}</div>
    </div>

    <div v-if="certifications.length === 0" class="no-certifications">
      {{ $t(noCertificationsKey) }}
    </div>
  </div>
</template>

<script>
export default {
  // This is the Vue component definition for the CertificationsList component.
  name: 'CertificationsList',
  props: {
    titleKey: {
      type: String,
      default: 'certifications.title'
    },
    certifications: {
      type: Array,
      default: () => []
    },
    noCertificationsKey: {
      type: String,
      default: 'certifications.noCertifications'
    }
  }
}
</script>

<style scoped>
.certifications-container {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 20px;
}

.certifications-title {
  font-size: 18px;
  color: #333;
  margin-bottom: 20px;
  font-weight: 600;
}

.certification-item {
  display: flex;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
}

.certification-item:last-child {
  border-bottom: none;
}

.certification-icon {
  width: 24px;
  height: 24px;
  background-color: #e9ecff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
}

.check-mark {
  color: #6366f1;
  font-weight: bold;
  font-size: 12px;
}

.certification-text {
  font-size: 14px;
  color: #333;
}

.no-certifications {
  text-align: center;
  padding: 15px;
  color: #888;
  font-style: italic;
}
</style>