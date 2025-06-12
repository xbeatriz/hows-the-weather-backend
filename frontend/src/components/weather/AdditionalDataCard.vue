<template>
  <div class="weather-data-card">
    <div class="card-header">
      <h3>Additional Weather Data</h3>
      <div class="date-selector">
        <button @click="prevDay" class="date-nav-btn" :disabled="loading"><span>&lt;</span></button>
        <span class="selected-date">{{ selectedDate }}</span>
        <button @click="nextDay" class="date-nav-btn" :disabled="loading"><span>&gt;</span></button>
      </div>
    </div>
    <div class="card-content">
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>Loading weather data...</p>
      </div>
      <div v-else-if="error" class="error-container">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <p>{{ error }}</p>
        <button @click="fetchWeatherData" class="retry-button">Try Again</button>
      </div>
      <div v-else class="data-tiles">
        <div class="data-tile">
          <div class="tile-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 9a4 4 0 0 0-2 7.5"></path>
              <path d="M12 3v2"></path>
              <path d="m6.6 18.4-1.4 1.4"></path>
              <path d="M20 4v-.5a.5.5 0 0 0-.5-.5H4a2 2 0 1 0 0 4h16a.5.5 0 0 0 .5-.5V4Z"></path>
              <path d="M12 19v2"></path>
              <path d="M18.4 18.4 19.8 20"></path>
              <path d="M4 12H2"></path>
              <path d="M6.6 5.6 5.2 4.2"></path>
              <path d="M19.8 5.6 18.4 4.2"></path>
              <path d="M22 12h-2"></path>
              <path d="m16 16-4 4"></path>
              <path d="M16 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"></path>
            </svg>
          </div>
          <div class="tile-label">Pressure</div>
          <div class="tile-value">{{ data.pressure }} hPa</div>
        </div>
        <div class="data-tile">
          <div class="tile-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"></path>
              <path d="M9.6 4.6A2 2 0 1 1 11 8H2"></path>
              <path d="M12.6 19.4A2 2 0 1 0 14 16H2"></path>
            </svg>
          </div>
          <div class="tile-label">Wind</div>
          <div class="tile-value">{{ data.windSpeed }} km/h</div>
          <div class="tile-subtitle">{{ data.windDirection }}</div>
        </div>
        <div class="data-tile">
          <div class="tile-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 16.2A4.5 4.5 0 0 1 17.5 8h-1.8A7 7 0 1 0 4 14.9"></path>
              <path d="M12 16v4"></path>
              <path d="m8 16 4 4"></path>
              <path d="m16 16-4 4"></path>
            </svg>
          </div>
          <div class="tile-label">Precipitation</div>
          <div class="tile-value">{{ data.precipitation }} mm</div>
        </div>
        <div class="data-tile">
          <div class="tile-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="4"></circle>
              <path d="M12 2v2"></path>
              <path d="M12 20v2"></path>
              <path d="m4.93 4.93 1.41 1.41"></path>
              <path d="m17.66 17.66 1.41 1.41"></path>
              <path d="M2 12h2"></path>
              <path d="M20 12h2"></path>
              <path d="m6.34 17.66-1.41 1.41"></path>
              <path d="m19.07 4.93-1.41 1.41"></path>
            </svg>
          </div>
          <div class="tile-label">UV Index</div>
          <div class="tile-value">{{ data.uvIndex }}</div>
          <div class="tile-subtitle">{{ getUVStatus(data.uvIndex) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdditionalDataCard',
  props: {
    selectedDate: {
      type: String,
      required: true
    },
    locationId: {
      type: [String, Number],
      required: true
    },
    apiBaseUrl: {
      type: String,
      default: 'http://localhost:3000/api'
    }
  },
  data() {
    return {
      data: {
        pressure: 0,
        windSpeed: 0,
        windDirection: 'N/A',
        precipitation: 0,
        uvIndex: 0
      },
      loading: false,
      error: null
    };
  },
  watch: {
    selectedDate() {
      this.fetchWeatherData();
    },
    locationId() {
      this.fetchWeatherData();
    }
  },
  created() {
    this.fetchWeatherData();
  },
  methods: {
    getUVStatus(index) {
      if (index <= 2) return 'Low';
      if (index <= 5) return 'Moderate';
      if (index <= 7) return 'High';
      if (index <= 10) return 'Very High';
      return 'Extreme';
    },
    prevDay() {
      this.$emit('prev-day');
    },
    nextDay() {
      this.$emit('next-day');
    },
    async fetchWeatherData() {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await fetch(`${this.apiBaseUrl}/weather/${this.locationId}/details?date=${this.selectedDate}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch weather data: ${response.statusText}`);
        }
        
        const weatherData = await response.json();
        
        // Map API response to our component data structure
        this.data = {
          pressure: weatherData.pressure || 0,
          windSpeed: weatherData.wind_speed || 0,
          windDirection: this.formatWindDirection(weatherData.wind_direction),
          precipitation: weatherData.precipitation || 0,
          uvIndex: weatherData.uv_index || 0
        };
      } catch (err) {
        console.error('Error fetching weather data:', err);
        this.error = 'Failed to load weather data. Please try again.';
      } finally {
        this.loading = false;
      }
    },
    formatWindDirection(degrees) {
      if (degrees == null) return 'N/A';
      
      const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 
                          'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
      
      // Convert degrees to one of 16 compass directions
      const index = Math.round(degrees / 22.5) % 16;
      return directions[index];
    }
  }
}
</script>

<style scoped>
.weather-data-card {
  margin: 0 20px 40px;
  width: calc(100% - 40px);
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05), 0 10px 15px rgba(0, 0, 0, 0.03);
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
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
}

.date-selector {
  display: flex;
  align-items: center;
  gap: 10px;
}

.date-nav-btn {
  width: 30px;
  height: 30px;
  border: none;
  background: #f1f5f9;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s;
}

.date-nav-btn:hover {
  background: #e2e8f0;
}

.date-nav-btn:disabled {
  background: #f1f1f1;
  color: #ccc;
  cursor: not-allowed;
}

.selected-date {
  font-size: 15px;
  color: #64748b;
}

.data-tiles {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.data-tile {
  flex: 1;
  min-width: 200px;
  background: #f8fafc;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  transition: transform 0.2s;
}

.data-tile:hover {
  transform: translateY(-5px);
}

.tile-icon {
  color: #0ea5e9;
  margin-bottom: 10px;
}

.tile-label {
  color: #64748b;
  font-size: 14px;
  margin-bottom: 5px;
}

.tile-value {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 2px;
}

.tile-subtitle {
  font-size: 12px;
  color: #94a3b8;
}

.loading-container, .error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
}

.loading-spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 4px solid #0ea5e9;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
}

.error-container svg {
  color: #ef4444;
  margin-bottom: 10px;
}

.error-container p {
  color: #64748b;
  margin-bottom: 15px;
}

.retry-button {
  background: #0ea5e9;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
}

.retry-button:hover {
  background: #0284c7;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (min-width: 2000px) {
  .weather-data-card {
    margin: 0 5% 40px;
    width: calc(100% - 10%);
  }
}

@media (min-width: 1440px) and (max-width: 1999px) {
  .weather-data-card {
    margin: 0 4% 40px;
    width: calc(100% - 8%);
  }
}

@media (min-width: 1025px) and (max-width: 1439px) {
  .weather-data-card {
    margin: 0 3% 40px;
    width: calc(100% - 6%);
  }
}

@media (max-width: 1024px) {
  .weather-data-card {
    margin: 0 20px 40px;
    width: calc(100% - 40px);
  }
}
</style>
