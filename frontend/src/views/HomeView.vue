<template>
  <div class="home" :class="{ 'sidebar-active': sidebarOpen }">
    <!-- Toggle Button for Sidebar -->
    <div class="sidebar-toggle" @click="toggleSidebar">
      <span class="toggle-icon">☰</span>
    </div>
    
    <!-- Sidebar Navigation -->
    <div class="sidebar" :class="{ 'open': sidebarOpen }">
      <div class="sidebar-header">
        <div class="profile-pic">
          <img src="..." alt="Profile Picture" />
        </div>
        <h3>User Name</h3>
        <p>user@example.com</p>
      </div>
      <div class="sidebar-menu">
        <router-link to="/profile" class="menu-item" aria-label="Go to my profile page">
          <div class="icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <span>My Profile</span>
        </router-link>
        <router-link to="/settings" class="menu-item" aria-label="Go to settings page">
          <div class="icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
          </div>
          <span>Settings</span>
        </router-link>
        <router-link to="/community" class="menu-item" aria-label="Go to community page">
          <div class="icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <span>Community</span>
        </router-link>
        <div class="menu-item logout" @click="logout" tabindex="0" role="button" aria-label="Log out of your account">
          <div class="icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </div>
          <span>Logout</span>
        </div>
      </div>
    </div>
    
    <!-- Overlay -->
    <div class="sidebar-overlay" v-if="sidebarOpen" @click="toggleSidebar"></div>
    
    <!-- Dashboard Content -->
    <div class="dashboard-content">
      <div class="welcome-section">
        <h1>Welcome back, User!</h1>
        <p>Here's your weather report for today</p>
      </div>
      
      <!-- Weather Card Grid -->
      <div class="weather-card-grid">
        <!-- Current Weather Card -->
        <div class="weather-card current-weather-card">
          <div class="card-header">
            <h3>Current Weather</h3>
            <span class="location-badge">{{ currentWeather.location }}</span>
          </div>
          <div class="card-content">
            <div class="weather-icon-large" :class="currentWeather.condition">
              <svg v-if="currentWeather.condition === 'sunny'" xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
              <svg v-else-if="currentWeather.condition === 'cloudy'" xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path>
              </svg>
              <svg v-else-if="currentWeather.condition === 'rainy'" xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
              <span class="temperature-value">{{ currentWeather.temperature }}°</span>
              <span class="temperature-unit">C</span>
            </div>
            <div class="weather-status">{{ getWeatherStatus(currentWeather.condition) }}</div>
            <div class="date-display">{{ currentDate }}</div>
          </div>
        </div>
        
        <!-- Forecast Card -->
        <div class="weather-card forecast-card">
          <div class="card-header">
            <h3>Forecast</h3>
            <div class="view-toggle">
              <button :class="{ active: activeView === 'daily' }" @click="activeView = 'daily'">Daily</button>
              <button :class="{ active: activeView === 'weekly' }" @click="activeView = 'weekly'">Weekly</button>
            </div>
          </div>
          <div class="card-content">
            <div v-if="activeView === 'daily'" class="forecast-daily">
              <div class="time-labels">
                <div v-for="(hour, index) in dailyTemperature" :key="'time-'+index" class="time-label">
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
                  <path :d="getTempAreaPath(dailyTemperature)" fill="url(#gradient)" />
                  
                  <!-- Temperature line -->
                  <path :d="getTempLinePath(dailyTemperature)" fill="none" stroke="#0ea5e9" stroke-width="3" />
                  
                  <!-- Temperature points -->
                  <g v-for="(point, index) in getTempPoints(dailyTemperature)" :key="'point-'+index">
                    <circle :cx="point.x" :cy="point.y" r="5" fill="#fff" stroke="#0ea5e9" stroke-width="2" />
                    <text :x="point.x" :y="point.y - 10" text-anchor="middle" font-size="12" fill="#334155">{{ dailyTemperature[index].temp }}°</text>
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
                  <tr v-for="(day, index) in weeklyTemperature" :key="'day-'+index">
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
      
      <!-- Metrics Cards -->
      <div class="metrics-card-grid">
        <!-- Humidity Card -->
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
          <div class="card-content">
            <div class="circular-progress-container">
              <div class="circular-progress">
                <svg viewBox="0 0 100 100">
                  <!-- Background circle -->
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#e2e8f0" stroke-width="8" />
                  
                  <!-- Progress circle -->
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#0ea5e9" stroke-width="8" stroke-dasharray="283" 
                    :stroke-dashoffset="283 - (283 * currentWeather.humidity) / 100" transform="rotate(-90 50 50)" />
                  
                  <!-- Percentage text -->
                  <text x="50" y="50" text-anchor="middle" dy="7" font-size="24" font-weight="bold" fill="#1e293b">{{ currentWeather.humidity }}%</text>
                </svg>
              </div>
            </div>
            <div class="humidity-status">{{ getHumidityStatus(currentWeather.humidity) }}</div>
          </div>
        </div>
        
        <!-- Air Quality Card -->
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
            <div class="air-quality-meter">
              <div class="meter-labels">
                <span>Good</span>
                <span>Moderate</span>
                <span>Unhealthy</span>
              </div>
              <div class="meter-bar">
                <div class="meter-fill" :style="{width: `${airQuality.value / 3}%`, backgroundColor: airQuality.color}"></div>
                <div class="meter-marker" :style="{left: `${airQuality.value / 3}%`}"></div>
              </div>
            </div>
            <div class="air-quality-details">
              <div class="aqi-value">AQI: <strong>{{ airQuality.value }}</strong></div>
              <div class="aqi-status" :style="{color: airQuality.color}">{{ airQuality.status }}</div>
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
                  <tr v-for="(pollutant, index) in airPollutants" :key="'pollutant-'+index">
                    <td>{{ pollutant.name }}</td>
                    <td>{{ pollutant.value }} {{ pollutant.unit }}</td>
                    <td :class="'status-' + pollutant.status.toLowerCase()">{{ pollutant.status }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Additional Weather Data -->
      <div class="weather-data-card">
        <div class="card-header">
          <h3>Additional Weather Data</h3>
          <div class="date-selector">
            <button @click="prevDay" class="date-nav-btn"><span>&lt;</span></button>
            <span class="selected-date">{{ selectedDate }}</span>
            <button @click="nextDay" class="date-nav-btn"><span>&gt;</span></button>
          </div>
        </div>
        <div class="card-content">
          <div class="data-tiles">
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
              <div class="tile-value">{{ additionalData.pressure }} hPa</div>
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
              <div class="tile-value">{{ additionalData.windSpeed }} km/h</div>
              <div class="tile-subtitle">{{ additionalData.windDirection }}</div>
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
              <div class="tile-value">{{ additionalData.precipitation }} mm</div>
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
              <div class="tile-value">{{ additionalData.uvIndex }}</div>
              <div class="tile-subtitle">{{ getUVStatus(additionalData.uvIndex) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeView',
  data() {
    return {
      sidebarOpen: false,
      activeView: 'daily',
      selectedDate: new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      currentDate: new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
      currentWeather: {
        temperature: 23,
        condition: 'sunny',
        location: 'Lisbon, Portugal',
        humidity: 65
      },
      dailyTemperature: [
        { time: '6AM', temp: 18 },
        { time: '9AM', temp: 20 },
        { time: '12PM', temp: 23 },
        { time: '3PM', temp: 25 },
        { time: '6PM', temp: 22 },
        { time: '9PM', temp: 19 }
      ],
      weeklyTemperature: [
        { day: 'Mon', icon: '☀️', high: 25, low: 18 },
        { day: 'Tue', icon: '⛅', high: 24, low: 17 },
        { day: 'Wed', icon: '☁️', high: 22, low: 16 },
        { day: 'Thu', icon: '🌧️', high: 20, low: 15 },
        { day: 'Fri', icon: '🌧️', high: 21, low: 16 },
        { day: 'Sat', icon: '⛅', high: 23, low: 17 },
        { day: 'Sun', icon: '☀️', high: 26, low: 19 }
      ],
      airQuality: {
        value: 45,
        status: 'Good',
        color: '#41B06E'
      },
      airPollutants: [
        { name: 'PM2.5', value: 12, unit: 'μg/m³', status: 'Good' },
        { name: 'PM10', value: 24, unit: 'μg/m³', status: 'Good' },
        { name: 'O₃', value: 85, unit: 'μg/m³', status: 'Moderate' },
        { name: 'NO₂', value: 15, unit: 'μg/m³', status: 'Good' }
      ],
      additionalData: {
        pressure: 1012,
        windSpeed: 12,
        windDirection: 'NE',
        precipitation: 0,
        uvIndex: 5
      }
    }
  },
  methods: {
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen;
      document.body.style.overflow = this.sidebarOpen ? 'hidden' : 'auto';
    },
    logout() {
      console.log('User logged out');
      // this.$router.push('/login');
    },
    getHumidityStatus(humidity) {
      if (humidity < 30) return 'Low - Dry air';
      if (humidity >= 30 && humidity <= 60) return 'Good - Comfortable';
      return 'High - Humid air';
    },
    getWeatherStatus(condition) {
      const statuses = {
        sunny: 'Clear sky',
        cloudy: 'Cloudy',
        rainy: 'Rainy',
        default: 'Partly cloudy'
      };
      return statuses[condition] || statuses.default;
    },
    getUVStatus(index) {
      if (index <= 2) return 'Low';
      if (index <= 5) return 'Moderate';
      if (index <= 7) return 'High';
      if (index <= 10) return 'Very High';
      return 'Extreme';
    },
    getTempLinePath(data) {
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
      const totalPoints = data.length;
      const width = 600;
      const height = 200;
      const xStep = width / (totalPoints - 1);
      
      return data.map((point, index) => ({
        x: index * xStep,
        y: height - (point.temp * 5)
      }));
    },
    prevDay() {
      // Just a placeholder in the demo
      console.log('Previous day selected');
    },
    nextDay() {
      // Just a placeholder in the demo
      console.log('Next day selected');
    }
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  width: 100%;
  height: 100%;
}


.home {
  width: 100%;
  min-height: 100vh; /* Tamanho mínimo igual à altura da tela */
  position: relative;
  background-color: #f8fafc;
  transition: margin-left 0.3s ease;
  color: #334155;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  overflow-x: hidden; /* evita scroll horizontal */
  padding: 1rem; /* adiciona espaçamento interno */
}


.home.sidebar-active {
  margin-left: 280px;
}

/* Sidebar Toggle Button */
.sidebar-toggle {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1001;
  width: 44px;  /* Larger for better touch target */
  height: 44px;
  background-color: #0ea5e9;
  color: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: background-color 0.2s, transform 0.2s;
}

.sidebar-toggle:hover, .sidebar-toggle:focus {
  background-color: #0284c7;
  transform: translateY(-2px);
}

.toggle-icon {
  font-size: 20px;
}

/* Sidebar Styles */
.sidebar {
  height: 100vh;
  width: 280px;
  background: linear-gradient(180deg, #ffffff 0%, #f1f5f9 100%);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  position: fixed;
  top: 0;
  left: -280px;
  z-index: 1000;
  transition: left 0.3s ease;
  padding-top: 80px;
  overflow-y: auto;
  border-radius: 0 16px 16px 0;
}

.sidebar.open {
  left: 0;
}

.sidebar-header {
  padding: 24px 20px;
  text-align: center;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 10px;
}

.profile-pic {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  overflow: hidden;
  margin: 0 auto 15px;
  border: 3px solid #0ea5e9;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.profile-pic:hover {
  transform: scale(1.05);
}

.profile-pic img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.sidebar-header h3 {
  color: #1e293b;
  margin-bottom: 5px;
  font-size: 1.2rem;
  font-weight: 600;
}

.sidebar-header p {
  color: #64748b;
  font-size: 0.9rem;
}

.sidebar-menu {
  padding: 20px;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 14px 16px;
  margin-bottom: 8px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
  color: #475569;
  position: relative;
  overflow: hidden;
}

.menu-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(14, 165, 233, 0.1), transparent);
  transition: left 0.5s;
}

.menu-item:hover::before {
  left: 100%;
}

.menu-item:hover, .menu-item:focus, .menu-item.router-link-exact-active {
  background-color: rgba(14, 165, 233, 0.1);
  color: #0ea5e9;
  transform: translateX(5px);
}

.menu-item .icon {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  width: 24px;
  height: 24px;
  color: #64748b;
  transition: color 0.2s;
}

.menu-item:hover .icon, .menu-item:focus .icon, .menu-item.router-link-exact-active .icon {
  color: #0ea5e9;
}

.menu-item span {
  font-weight: 500;
  font-size: 1rem;
  transition: color 0.2s;
}

.menu-item.logout {
  margin-top: 40px;
  border-top: 1px solid #e2e8f0;
  padding-top: 24px;
  color: #ef4444;
}

.menu-item.logout:hover, .menu-item.logout:focus {
  background-color: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.menu-item.logout .icon {
  color: #ef4444;
}

.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);
  z-index: 999;
  transition: opacity 0.3s;
}

/* Dashboard Content Styles */
.dashboard-content {
  padding: 80px 0 40px; /* Remove horizontal padding to allow full width */
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  transition: padding 0.3s ease;
  box-sizing: border-box;
}

/* Modern Card Grid Layouts */
.weather-card-grid {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 20px;
  margin: 0 20px 20px; /* Use margin instead of padding to maintain full width */
  width: calc(100% - 40px); /* Adjust for the margins */
}

.current-weather-card {
  flex: 1;
  min-width: 300px;
  height: auto; /* Allow height to adapt to content */
  min-height: 400px; /* Ensure minimum height */
}

.forecast-card {
  flex: 2;
  min-width: 500px;
  height: auto; /* Allow height to adapt to content */
}

.metrics-card-grid {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 20px;
  margin: 0 20px 20px; /* Use margin instead of padding */
  width: calc(100% - 40px); /* Adjust for the margins */
}

.metric-card {
  flex: 1;
  min-width: 300px;
  height: auto; /* Allow height to adapt to content */
}

/* Card Styles */
.weather-card, .metric-card, .weather-data-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05), 0 10px 15px rgba(0, 0, 0, 0.03);
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
  width: 100%;
  display: flex; /* Add flexbox for better content distribution */
  flex-direction: column; /* Stack children vertically */
}

/* Card Header */
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

/* Card Content */
.card-content {
  padding: 20px;
  flex: 1; /* Allow content to expand */
  display: flex;
  flex-direction: column;
}

/* Current Weather Card */
.current-weather-card .card-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px; /* Reduce padding slightly */
  justify-content: center; /* Center content vertically */
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

/* Forecast Card */
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

/* Humidity Card */
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

/* Air Quality Card */
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

/* Additional Weather Data Card */
.weather-data-card {
  margin: 0 20px 40px; /* Use margin instead of padding */
  width: calc(100% - 40px); /* Adjust for the margins */
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

/* Responsive Adjustments */
@media (min-width: 2000px) {
  .weather-card-grid, .metrics-card-grid {
    margin: 0 5% 20px; /* Percentage-based margins */
    width: calc(100% - 10%); /* Adjust for the margins */
  }
  
  .weather-data-card {
    margin: 0 5% 40px;
    width: calc(100% - 10%);
  }
}

@media (min-width: 1440px) and (max-width: 1999px) {
  .weather-card-grid, .metrics-card-grid {
    margin: 0 4% 20px;
    width: calc(100% - 8%);
  }
  
  .weather-data-card {
    margin: 0 4% 40px;
    width: calc(100% - 8%);
  }
}

@media (min-width: 1025px) and (max-width: 1439px) {
  .weather-card-grid, .metrics-card-grid {
    margin: 0 3% 20px;
    width: calc(100% - 6%);
  }
  
  .weather-data-card {
    margin: 0 3% 40px;
    width: calc(100% - 6%);
  }
  
  .forecast-card {
    min-width: 450px;
  }
}

@media (max-width: 1024px) {
  .weather-card-grid, .metrics-card-grid {
    flex-direction: column;
    margin: 0 20px 20px;
    width: calc(100% - 40px);
  }
  
  .current-weather-card, .forecast-card, .metric-card {
    width: 100%;
    min-width: 100%;
    max-width: 100%;
    min-height: auto; /* Allow height to be determined by content */
  }
  
  .weather-data-card {
    margin: 0 20px 40px;
    width: calc(100% - 40px);
  }
}

/* Accessibility enhancements */
.menu-item:focus {
  outline: 2px solid #0ea5e9;
  outline-offset: -2px;
}

.menu-item.logout:focus {
  outline: 2px solid #ef4444;
}

/* Screen reader only class */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

@media (prefers-reduced-motion: reduce) {
  .home,
  .sidebar,
  .sidebar-toggle,
  .menu-item,
  .profile-pic {
    transition: none;
  }
  
  .menu-item::before {
    display: none;
  }
}
</style>
