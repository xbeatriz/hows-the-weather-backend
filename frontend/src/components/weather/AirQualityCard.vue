<template>
  <div class="metric-card air-quality-card">
    <div class="card-header">
      <h3>Air Quality</h3>
      <div class="metric-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M8 2v2"></path>
          <path d="M16 2v2"></path>
          <path d="M8 20v2"></path>
          <path d="M16 20v2"></path>
          <path d="M2 8h2"></path>
          <path d="M2 16h2"></path>
          <path d="M20 8h2"></path>
          <path d="M20 16h2"></path>
          <path d="M9 4v4a2 2 0 0 1-2 2H3"></path>
          <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"></path>
          <path d="M12 11v2"></path>
          <path d="M12 15.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1Z"></path>
        </svg>
      </div>
    </div>
    <div class="card-content">
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Loading air quality data...</p>
      </div>
      
      <div v-else-if="error" class="error-state">
        <p>{{ error }}</p>
        <button @click="fetchAirQualityData" class="retry-button">Retry</button>
      </div>
      
      <template v-else>
        <div class="air-quality-meter">
          <div class="meter-labels">
            <span>Good</span>
            <span>Moderate</span>
            <span>Unhealthy</span>
          </div>
          <div class="meter-bar">
            <div class="meter-fill" :style="{width: `${airQualityPercentage}%`, backgroundColor: airQualityData.color}"></div>
            <div class="meter-marker" :style="{left: `${airQualityPercentage}%`}"></div>
          </div>
        </div>
        <div class="air-quality-details">
          <div class="aqi-value">AQI: <strong>{{ airQualityData.value }}</strong></div>
          <div class="aqi-status" :style="{color: airQualityData.color}">{{ airQualityData.status }}</div>
        </div>
        <div class="pollutants-table">
          <table>
            <thead>
              <tr>
                <th>Pollutant</th>
                <th>Value</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(pollutant, index) in airPollutantsData" :key="'pollutant-'+index">
                <td>{{ pollutant.name }}</td>
                <td>{{ pollutant.value }} {{ pollutant.unit }}</td>
                <td :class="'status-' + pollutant.status.toLowerCase()">{{ pollutant.status }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AirQualityCard',
  props: {
    latitude: {
      type: Number,
      required: true
    },
    longitude: {
      type: Number,
      required: true
    },
    apiEndpoint: {
      type: String,
      default: '/api/air-quality'
    }
  },
  data() {
    return {
      loading: true,
      error: null,
      airQualityData: {
        value: 0,
        color: '#41B06E',
        status: 'Good'
      },
      airPollutantsData: []
    };
  },
  computed: {
    airQualityPercentage() {
      // Map the AQI value to a percentage (assuming max AQI is 300 for display purposes)
      // AQI range is typically 0-500, but we limit the visual scale to make it more readable
      const maxAqi = 300;
      return Math.min(this.airQualityData.value / maxAqi * 100, 100);
    }
  },
  mounted() {
    this.fetchAirQualityData();
  },
  watch: {
    // Refetch when location changes
    latitude() {
      this.fetchAirQualityData();
    },
    longitude() {
      this.fetchAirQualityData();
    }
  },
  methods: {
    async fetchAirQualityData() {
      this.loading = true;
      this.error = null;

      try {
        const params = new URLSearchParams({
          lat: this.latitude,
          lon: this.longitude
        });
        
        const response = await fetch(`${this.apiEndpoint}?${params}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch air quality data: ${response.statusText}`);
        }
        
        const data = await response.json();
        this.processAirQualityData(data);
      } catch (err) {
        console.error('Error fetching air quality data:', err);
        this.error = 'Unable to load air quality data. Please try again.';
      } finally {
        this.loading = false;
      }
    },
    
    processAirQualityData(data) {
      // Process AQI value and status
      const aqi = data.aqi || data.main?.aqi || 0;
      this.airQualityData = {
        value: aqi,
        ...this.getAqiStatus(aqi)
      };
      
      // Process pollutants
      this.airPollutantsData = this.processPollutantData(data.components || {});
    },
    
    getAqiStatus(aqi) {
      // Map AQI to status and color based on standard classifications
      if (aqi <= 50) {
        return { status: 'Good', color: '#41B06E' }; // Green
      } else if (aqi <= 100) {
        return { status: 'Moderate', color: '#f59e0b' }; // Yellow
      } else if (aqi <= 150) {
        return { status: 'Unhealthy for Sensitive Groups', color: '#f97316' }; // Orange
      } else if (aqi <= 200) {
        return { status: 'Unhealthy', color: '#ef4444' }; // Red
      } else if (aqi <= 300) {
        return { status: 'Very Unhealthy', color: '#9333ea' }; // Purple
      } else {
        return { status: 'Hazardous', color: '#7f1d1d' }; // Dark red/maroon
      }
    },
    
    processPollutantData(components) {
      const pollutants = [];
      
      // Map of pollutant keys to human-readable names and units
      const pollutantMap = {
        co: { name: 'Carbon Monoxide', unit: 'μg/m³' },
        no: { name: 'Nitric Oxide', unit: 'μg/m³' },
        no2: { name: 'Nitrogen Dioxide', unit: 'μg/m³' },
        o3: { name: 'Ozone', unit: 'μg/m³' },
        so2: { name: 'Sulfur Dioxide', unit: 'μg/m³' },
        pm2_5: { name: 'PM2.5', unit: 'μg/m³' },
        pm10: { name: 'PM10', unit: 'μg/m³' },
        nh3: { name: 'Ammonia', unit: 'μg/m³' }
      };
      
      // Process each pollutant from the API response
      Object.keys(components).forEach(key => {
        if (pollutantMap[key]) {
          const value = components[key];
          let status = 'Good';
          
          // Determine status based on typical threshold values
          // These thresholds may need to be adjusted based on your specific API
          if (key === 'pm2_5') {
            if (value > 35) status = 'Poor';
            else if (value > 12) status = 'Moderate';
          } else if (key === 'pm10') {
            if (value > 150) status = 'Poor';
            else if (value > 50) status = 'Moderate';
          } else if (key === 'o3') {
            if (value > 120) status = 'Poor';
            else if (value > 70) status = 'Moderate';
          } else if (key === 'no2') {
            if (value > 200) status = 'Poor';
            else if (value > 100) status = 'Moderate';
          } else if (key === 'so2') {
            if (value > 350) status = 'Poor';
            else if (value > 100) status = 'Moderate';
          } else if (key === 'co') {
            if (value > 15000) status = 'Poor';
            else if (value > 7000) status = 'Moderate';
          }
          
          pollutants.push({
            name: pollutantMap[key].name,
            value: Math.round(value * 100) / 100, // Round to 2 decimal places
            unit: pollutantMap[key].unit,
            status
          });
        }
      });
      
      return pollutants;
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

.air-quality-meter {
  margin: 20px 0;
}

.meter-labels {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}

.meter-labels span {
  font-size: 14px;
  color: #64748b;
}

.meter-bar {
  position: relative;
  height: 10px;
  background-color: #f1f5f9;
  border-radius: 5px;
  overflow: hidden;
}

.meter-fill {
  height: 100%;
  background-color: #41B06E;
  border-radius: 5px;
  transition: width 1s ease-in-out;
}

.meter-marker {
  position: absolute;
  width: 2px;
  height: 16px;
  top: -3px;
  background-color: #1e293b;
}

.air-quality-details {
  display: flex;
  justify-content: space-between;
  margin: 15px 0;
}

.aqi-value {
  font-size: 16px;
  color: #1e293b;
}

.aqi-status {
  font-weight: 600;
}

/* Pollutants Table */
.pollutants-table table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.pollutants-table th {
  text-align: left;
  padding: 10px 5px;
  color: #64748b;
  border-bottom: 1px solid #f1f5f9;
}

.pollutants-table td {
  padding: 8px 5px;
  border-bottom: 1px solid #f8fafc;
}

.status-good {
  color: #41B06E;
}

.status-moderate {
  color: #f59e0b;
}

.status-poor {
  color: #ef4444;
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  color: #64748b;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #0ea5e9;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Error State */
.error-state {
  text-align: center;
  padding: 30px 0;
  color: #ef4444;
}

.retry-button {
  background-color: #0ea5e9;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  margin-top: 12px;
  transition: background-color 0.2s;
}

.retry-button:hover {
  background-color: #0284c7;
}

/* Additional statuses for air quality */
.status-unhealthy {
  color: #ef4444;
}

.status-very-unhealthy {
  color: #9333ea;
}

.status-hazardous {
  color: #7f1d1d;
}

@media (max-width: 1024px) {
  .metric-card {
    min-width: 100%;
  }
}
</style>
