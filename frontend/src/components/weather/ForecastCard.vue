<template>
  <div class="weather-card forecast-card">
    <div class="card-header">
      <h3>Forecast</h3>
      <div class="view-toggle">
        <button :class="{ active: activeView === 'daily' }" @click="activeView = 'daily'">Daily</button>
        <button :class="{ active: activeView === 'weekly' }" @click="activeView = 'weekly'">Weekly</button>
      </div>
    </div>
    <div class="card-content">
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>Loading forecast data...</p>
      </div>
      <div v-else-if="error" class="error-message">
        <p>{{ error }}</p>
        <button @click="fetchForecastData" class="retry-button">Try Again</button>
      </div>
      <div v-else>
        <div v-if="activeView === 'daily'" class="forecast-daily">
          <div class="time-labels">
            <div v-for="(hour, index) in dailyForecast" :key="'time-'+index" class="time-label">
              {{ hour.time }}
            </div>
          </div>
          <div class="chart-container">
            <svg class="line-chart" viewBox="0 0 600 200">
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stop-color="#0ea5e9" stop-opacity="0.4" />
                  <stop offset="100%" stop-color="#0ea5e9" stop-opacity="0" />
                </linearGradient>
              </defs>
              
              <!-- Temperature area fill -->
              <path :d="getTempAreaPath(dailyForecast)" fill="url(#gradient)" />
              
              <!-- Temperature line -->
              <path :d="getTempLinePath(dailyForecast)" fill="none" stroke="#0ea5e9" stroke-width="3" />
              
              <!-- Temperature points -->
              <g v-for="(point, index) in getTempPoints(dailyForecast)" :key="'point-'+index">
                <circle :cx="point.x" :cy="point.y" r="5" fill="#fff" stroke="#0ea5e9" stroke-width="2" />
                <text :x="point.x" :y="point.y - 10" text-anchor="middle" font-size="12" fill="#334155">{{ dailyForecast[index].temp }}°</text>
              </g>
            </svg>
          </div>
        </div>
        <div v-else class="forecast-weekly">
          <table class="forecast-table">
            <thead>
              <tr>
                <th>Day</th>
                <th>Condition</th>
                <th>High</th>
                <th>Low</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(day, index) in weeklyForecast" :key="'day-'+index">
                <td>{{ day.day }}</td>
                <td class="condition-cell">{{ day.icon }}</td>
                <td class="high-cell">{{ day.high }}°C</td>
                <td class="low-cell">{{ day.low }}°C</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//import { fetch } from 'express'; // Import fetch from express

export default {
  name: 'ForecastCard',
  props: {
    location: {
      type: Object,
      default: () => ({ lat: null, lon: null, city: null })
    }
  },
  data() {
    return {
      activeView: 'daily',
      loading: true,
      error: null,
      dailyForecast: [],
      weeklyForecast: []
    }
  },
  computed: {
    hasLocation() {
      return this.location.lat && this.location.lon || this.location.city;
    }
  },
  watch: {
    location: {
      handler() {
        if (this.hasLocation) {
          this.fetchForecastData();
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    // If location is already available when component mounts
    if (this.hasLocation) {
      this.fetchForecastData();
    }
  },
  methods: {
    async fetchForecastData() {
      if (!this.hasLocation) return;
      
      this.loading = true;
      this.error = null;
      
      try {
        // Determine whether to use coordinates or city name
        const params = this.location.city ? 
          `city=${this.location.city}` : 
          `lat=${this.location.lat}&lon=${this.location.lon}`;

        // Get daily forecast
        const dailyResponse = await fetch(`/api/forecast/daily?${params}`);
        const dailyData = await dailyResponse.json();
        this.dailyForecast = this.formatDailyForecast(dailyData);
        
        // Get weekly forecast
        const weeklyResponse = await fetch(`/api/forecast/weekly?${params}`);
        const weeklyData = await weeklyResponse.json();
        this.weeklyForecast = this.formatWeeklyForecast(weeklyData);
        
        this.loading = false;
      } catch (err) {
        console.error('Error fetching forecast data:', err);
        this.error = 'Failed to load forecast data. Please try again.';
        this.loading = false;
      }
    },
    
    formatDailyForecast(data) {
      // Transform API data to match the component's expected format
      // Adjust this based on your actual API response structure
      return Array.isArray(data) ? data.map(item => ({
        time: item.time || item.dt_txt?.substring(11, 16) || '',
        temp: item.temp || item.main?.temp || 0
      })) : [];
    },
    
    formatWeeklyForecast(data) {
      // Transform API data to match the component's expected format
      // Adjust this based on your actual API response structure
      return Array.isArray(data) ? data.map(item => ({
        day: item.day || new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
        icon: item.icon || '☀️', // Default icon if not provided
        high: item.high || item.main?.temp_max || 0,
        low: item.low || item.main?.temp_min || 0
      })) : [];
    },
    
    getTempLinePath(data) {
      if (!data.length) return '';
      
      const totalPoints = data.length;
      const width = 600;
      const height = 200;
      const xStep = width / (totalPoints - 1);
      
      let path = '';
      data.forEach((point, index) => {
        const x = index * xStep;
        const y = height - (point.temp * 5);
        
        if (index === 0) {
          path += `M ${x} ${y}`;
        } else {
          path += ` L ${x} ${y}`;
        }
      });
      
      return path;
    },
    
    getTempAreaPath(data) {
      if (!data.length) return '';
      
      const totalPoints = data.length;
      const width = 600;
      const height = 200;
      const xStep = width / (totalPoints - 1);
      
      let path = '';
      
      // Start at the bottom left
      path += `M 0 ${height}`;
      
      // Draw line to the first data point
      path += ` L 0 ${height - (data[0].temp * 5)}`;
      
      // Draw lines through all data points
      data.forEach((point, index) => {
        const x = index * xStep;
        const y = height - (point.temp * 5);
        path += ` L ${x} ${y}`;
      });
      
      // Close the path to the bottom right
      path += ` L ${width} ${height} Z`;
      
      return path;
    },
    
    getTempPoints(data) {
      if (!data.length) return [];
      
      const totalPoints = data.length;
      const width = 600;
      const height = 200;
      const xStep = width / (totalPoints - 1);
      
      return data.map((point, index) => ({
        x: index * xStep,
        y: height - (point.temp * 5)
      }));
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

.forecast-card {
  flex: 2;
  min-width: 500px;
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

.card-content {
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.view-toggle {
  display: flex;
  background: #f1f5f9;
  border-radius: 20px;
  padding: 3px;
}

.view-toggle button {
  background: none;
  border: none;
  padding: 5px 15px;
  cursor: pointer;
  color: #64748b;
  border-radius: 20px;
  font-weight: 500;
  transition: all 0.2s;
}

.view-toggle button.active {
  background-color: #0ea5e9;
  color: white;
}

.chart-container {
  height: 200px;
  margin-top: 20px;
  overflow: hidden;
}

.time-labels {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}

.time-label {
  font-size: 14px;
  color: #64748b;
  flex: 1;
  text-align: center;
}

/* Forecast Table */
.forecast-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.forecast-table th {
  text-align: left;
  font-weight: 600;
  color: #64748b;
  padding: 10px;
  border-bottom: 1px solid #f1f5f9;
}

.forecast-table td {
  padding: 12px 10px;
  border-bottom: 1px solid #f8fafc;
}

.forecast-table .condition-cell {
  font-size: 20px;
}

.forecast-table .high-cell {
  color: #ef4444;
  font-weight: 600;
}

.forecast-table .low-cell {
  color: #3b82f6;
  font-weight: 600;
}

/* Loading and Error States */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: #64748b;
}

.loading-spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border-left-color: #0ea5e9;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

.error-message {
  text-align: center;
  color: #ef4444;
  padding: 30px;
}

.retry-button {
  background-color: #0ea5e9;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 8px 16px;
  cursor: pointer;
  font-weight: 500;
  margin-top: 15px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 1024px) {
  .forecast-card {
    min-width: 100%;
  }
}
</style>
