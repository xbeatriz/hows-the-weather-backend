<template>
  <div class="weather-card current-weather-card">
    <div class="card-header">
      <h3>Current Weather</h3>
      <span class="location-badge">{{ weatherData.location || 'Loading...' }}</span>
    </div>
    <div v-if="loading" class="card-content loading-container">
      <div class="loader"></div>
      <p>Loading weather data...</p>
    </div>
    <div v-else-if="error" class="card-content error-container">
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      <p>{{ error }}</p>
      <button @click="fetchWeatherData" class="retry-button">Retry</button>
    </div>
    <div v-else class="card-content">
      <div class="weather-icon-large" :class="weatherData.condition">
        <svg v-if="weatherData.condition === 'sunny'" xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
        <svg v-else-if="weatherData.condition === 'cloudy'" xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path>
        </svg>
        <svg v-else-if="weatherData.condition === 'rainy'" xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="16" y1="13" x2="16" y2="21"></line>
          <line x1="8" y1="13" x2="8" y2="21"></line>
          <line x1="12" y1="15" x2="12" y2="23"></line>
          <path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"></path>
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2v2"></path>
          <path d="M12 20v2"></path>
          <path d="m4.93 4.93 1.41 1.41"></path>
          <path d="m17.66 17.66 1.41 1.41"></path>
          <path d="M2 12h2"></path>
          <path d="M20 12h2"></path>
          <path d="m6.34 17.66-1.41 1.41"></path>
          <path d="m19.07 4.93-1.41 1.41"></path>
          <path d="M10 6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-4Z"></path>
          <path d="M12 10v4"></path>
        </svg>
      </div>
      <div class="temperature-display">
        <span class="temperature-value">{{ weatherData.temperature }}°</span>
        <span class="temperature-unit">C</span>
      </div>
      <div class="weather-status">{{ getWeatherStatus(weatherData.condition) }}</div>
      <div class="date-display">{{ formattedDate }}</div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'CurrentWeatherCard',
  props: {
    locationId: {
      type: [String, Number],
      default: null
    },
    apiUrl: {
      type: String,
      default: '/api/weather/current'
    }
  },
  data() {
    return {
      weatherData: {
        location: '',
        temperature: 0,
        condition: 'default'
      },
      loading: true,
      error: null,
      lastUpdated: null
    }
  },
  computed: {
    formattedDate() {
      if (!this.lastUpdated) return '';
      const date = new Date(this.lastUpdated);
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  },
  methods: {
    getWeatherStatus(condition) {
      const statuses = {
        sunny: 'Clear sky',
        cloudy: 'Cloudy',
        rainy: 'Rainy',
        default: 'Partly cloudy'
      };
      return statuses[condition] || statuses.default;
    },
    async fetchWeatherData() {
      this.loading = true;
      this.error = null;
      
      try {
        const endpoint = this.locationId ? 
          `${this.apiUrl}/${this.locationId}` : 
          this.apiUrl;
          
        const response = await fetch(endpoint);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data) {
          this.weatherData = {
            location: data.location || 'Unknown',
            temperature: data.temperature || 0,
            condition: data.condition || 'default'
          };
          this.lastUpdated = new Date();
        } else {
          throw new Error('Invalid response from server');
        }
      } catch (err) {
        console.error('Error fetching weather data:', err);
        this.error = 'Failed to load weather data. Please try again.';
      } finally {
        this.loading = false;
      }
    }
  },
  mounted() {
    this.fetchWeatherData();
    // Optional: Set up polling to regularly update weather data
    this.intervalId = setInterval(() => {
      this.fetchWeatherData();
    }, 30 * 60 * 1000); // Update every 30 minutes
  },
  beforeUnmount() {
    // Clear interval when component is destroyed
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
</script>

<style scoped>
.weather-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05), 0 10px 15px rgba(0, 0, 0, 0.03);
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.current-weather-card {
  flex: 1;
  min-width: 300px;
  height: auto;
  min-height: 400px;
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

.card-content {
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.location-badge {
  background: #f1f5f9;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 14px;
  color: #64748b;
}

.weather-icon-large {
  margin: 20px 0;
  color: #0ea5e9;
}

.weather-icon-large.sunny {
  color: #fbbf24;
}

.weather-icon-large.cloudy {
  color: #94a3b8;
}

.weather-icon-large.rainy {
  color: #60a5fa;
}

.temperature-display {
  display: flex;
  align-items: flex-start;
  margin-bottom: 10px;
}

.temperature-value {
  font-size: 64px;
  font-weight: 700;
  line-height: 1;
  color: #1e293b;
}

.temperature-unit {
  font-size: 24px;
  margin-top: 10px;
  color: #64748b;
}

.weather-status {
  font-size: 20px;
  color: #64748b;
  margin-bottom: 10px;
}

.date-display {
  font-size: 14px;
  color: #94a3b8;
}

.loading-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 40px 0;
}

.loader {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #0ea5e9;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 2s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #ef4444;
  padding: 20px;
  text-align: center;
}

.error-container svg {
  margin-bottom: 16px;
}

.retry-button {
  margin-top: 16px;
  background-color: #0ea5e9;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s;
}

.retry-button:hover {
  background-color: #0284c7;
}
</style>
