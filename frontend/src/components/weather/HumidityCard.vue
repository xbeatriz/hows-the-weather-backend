<template>
  <div class="metric-card humidity-card">
    <div class="card-header">
      <h3>Humidity</h3>
      <div class="metric-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z"></path>
          <path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97"></path>
        </svg>
      </div>
    </div>
    <div class="card-content" v-if="loading">
      <div class="loading-spinner">
        <div class="spinner"></div>
        <p>Loading humidity data...</p>
      </div>
    </div>
    <div class="card-content" v-else-if="error">
      <div class="error-message">
        <p>{{ error }}</p>
        <button @click="fetchHumidityData" class="retry-button">Retry</button>
      </div>
    </div>
    <div class="card-content" v-else>
      <div class="circular-progress-container">
        <div class="circular-progress">
          <svg viewBox="0 0 100 100">
            <!-- Background circle -->
            <circle cx="50" cy="50" r="45" fill="none" stroke="#e2e8f0" stroke-width="8" />
            
            <!-- Progress circle -->
            <circle cx="50" cy="50" r="45" fill="none" stroke="#0ea5e9" stroke-width="8" stroke-dasharray="283" 
              :stroke-dashoffset="283 - (283 * currentHumidity) / 100" transform="rotate(-90 50 50)" />
            
            <!-- Percentage text -->
            <text x="50" y="50" text-anchor="middle" dy="7" font-size="24" font-weight="bold" fill="#1e293b">{{ currentHumidity }}%</text>
          </svg>
        </div>
      </div>
      <div class="humidity-status">{{ getHumidityStatus(currentHumidity) }}</div>
      <div class="last-updated" v-if="lastUpdated">
        Last updated: {{ lastUpdated }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HumidityCard',
  props: {
    humidity: {
      type: Number,
      required: false,
      default: null
    },
    apiUrl: {
      type: String,
      required: false,
      default: '/api/weather/humidity'
    },
    autoRefresh: {
      type: Boolean,
      default: false
    },
    refreshInterval: {
      type: Number,
      default: 60000 // 1 minute
    }
  },
  data() {
    return {
      fetchedHumidity: null,
      loading: false,
      error: null,
      lastUpdated: null,
      refreshTimer: null
    }
  },
  computed: {
    currentHumidity() {
      // Use prop if provided, otherwise use fetched data
      return this.humidity !== null ? this.humidity : this.fetchedHumidity;
    }
  },
  methods: {
    getHumidityStatus(humidity) {
      if (humidity < 30) return 'Low - Dry air';
      if (humidity >= 30 && humidity <= 60) return 'Good - Comfortable';
      return 'High - Humid air';
    },
    async fetchHumidityData() {
      // Skip API call if humidity is provided as a prop
      if (this.humidity !== null) return;
      
      this.loading = true;
      this.error = null;
      
      try {
        const response = await fetch(this.apiUrl);
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        this.fetchedHumidity = data.humidity;
        this.lastUpdated = new Date().toLocaleTimeString();
      } catch (err) {
        console.error('Error fetching humidity data:', err);
        this.error = 'Failed to load humidity data. Please try again.';
      } finally {
        this.loading = false;
      }
    },
    setupAutoRefresh() {
      if (this.autoRefresh && this.humidity === null) {
        this.refreshTimer = setInterval(() => {
          this.fetchHumidityData();
        }, this.refreshInterval);
      }
    },
    clearAutoRefresh() {
      if (this.refreshTimer) {
        clearInterval(this.refreshTimer);
        this.refreshTimer = null;
      }
    }
  },
  created() {
    if (this.humidity === null) {
      this.fetchHumidityData();
    }
  },
  mounted() {
    this.setupAutoRefresh();
  },
  beforeUnmount() {
    this.clearAutoRefresh();
  },
  watch: {
    apiUrl() {
      this.fetchHumidityData();
    }
  }
}
</script>

<style scoped>
.metric-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05), 0 10px 15px rgba(0, 0, 0, 0.03);
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
  width: 100%;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 300px;
  height: auto;
}

.card-header {
  padding: 16px 20px;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  font-size: 18px;
  color: #1e293b;
  font-weight: 600;
  margin: 0;
}

.metric-icon {
  color: #0ea5e9;
}

.card-content {
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.circular-progress-container {
  display: flex;
  justify-content: center;
  margin: 20px 0;
}

.circular-progress {
  width: 150px;
  height: 150px;
}

.humidity-status {
  text-align: center;
  margin-top: 15px;
  font-size: 16px;
  color: #64748b;
}

.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #0ea5e9;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #ef4444;
  text-align: center;
}

.retry-button {
  background-color: #0ea5e9;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  margin-top: 10px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.3s;
}

.retry-button:hover {
  background-color: #0284c7;
}

.last-updated {
  text-align: center;
  font-size: 12px;
  color: #94a3b8;
  margin-top: 10px;
}

@media (max-width: 1024px) {
  .metric-card {
    min-width: 100%;
  }
}
</style>
