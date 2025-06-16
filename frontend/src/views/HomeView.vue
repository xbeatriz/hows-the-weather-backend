<template>
  <div class="home">
    <!-- Sidebar Component - adjust props and events to match the actual component -->
    <Sidebar :headerText="'Painel de Controlo'" :user="user" :activeMenu="activeMenu" @menuChange="handleMenuChange"
      @logout="handleLogout" />

    <!-- Dashboard Content -->
    <div class="dashboard-content">
      <div class="welcome-section">
        <h1>Welcome back, {{ user.name }}!</h1>
        <p>Here's your weather report for today</p>
      </div>

      <!-- Weather Card Grid -->
      <div class="weather-card-grid">
        <!-- Current Weather Card -->
        <CurrentWeatherCard :weather="currentWeather" :currentDate="currentDate" />

        <!-- Forecast Card -->
        <ForecastCard :dailyTemperature="dailyTemperature" :weeklyTemperature="weeklyTemperature" />
      </div>

      <!-- Metrics Cards -->
      <div class="metrics-card-grid">
        <!-- Humidity Card -->
        <HumidityCard :humidity="currentWeather.humidity" />

        <!-- Air Quality Card -->
        <AirQualityCard :airQuality="airQuality" :airPollutants="airPollutants" />
      </div>

      <!-- Additional Weather Data -->
      <AdditionalDataCard :data="additionalData" :selectedDate="selectedDate" @prev-day="prevDay" @next-day="nextDay" />
    </div>
  </div>
</template>

<script>
// Import components
import Sidebar from '@/components/dashboard/Sidebar.vue'; // Changed to lowercase if needed
import CurrentWeatherCard from '@/components/weather/CurrentWeatherCard.vue';
import ForecastCard from '@/components/weather/ForecastCard.vue';
import HumidityCard from '@/components/weather/HumidityCard.vue';
import AirQualityCard from '@/components/weather/AirQualityCard.vue';
import AdditionalDataCard from '@/components/weather/AdditionalDataCard.vue';
import { useUserStore } from '@/stores/userStore';
import{computed} from 'vue';

export default {
  name: 'HomeView',
  components: {
    Sidebar,
    CurrentWeatherCard,
    ForecastCard,
    HumidityCard,
    AirQualityCard,
    AdditionalDataCard
  },
  data() {
    return {
      selectedDate: new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      currentDate: new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
      currentWeather: {
        temperature: 23,
        condition: 'sunny',
        location: 'Lisbon, Portugal',
        humidity: 65
      },
      user: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        role: 'Administrator',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
      },
      activeMenu: 'overview',
      componentData: {},
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
  setup() {
    const userStore = useUserStore();
    const user = computed(() => userStore.user);
    return { user };
  },
  methods: {
    handleMenuChange(menuId) {
      this.activeMenu = menuId;
    },
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen;
      document.body.style.overflow = this.sidebarOpen ? 'hidden' : 'auto';
    },
    handleLogout() {
      useUserStore().logout();
      this.$router.push("/login");
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

html,
body {
  width: 100%;
  height: 100%;
}

.home {
  display: flex;
  height: 100vh;
  position: fixed;
  background-color: #f5f7fa;
  width: 100%;
  transition: margin-left 0.3s ease;
  color: #334155;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  overflow-x: hidden;
}

.home.sidebar-active {
  margin-left: 280px;
}

/* Dashboard Content Styles */
.dashboard-content {
  padding: 16px;
  width: 100%;
  transition: padding 0.3s ease;
  box-sizing: border-box;
}

/* Welcome section */
.welcome-section {
  margin: 16px 16px;
}

.welcome-section h1 {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 8px;
}

.welcome-section p {
  font-size: 16px;
  color: #64748b;
}

/* Modern Card Grid Layouts */
.weather-card-grid {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
  gap: 20px;
}

.metrics-card-grid {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 20px;
  margin: 0 20px 20px;
  width: calc(100% - 40px);
}

/* Responsive Adjustments */
@media (min-width: 2000px) {

  .weather-card-grid,
  .metrics-card-grid {
    margin: 0 5% 20px;
    width: calc(100% - 10%);
  }
}

@media (min-width: 1440px) and (max-width: 1999px) {

  .weather-card-grid,
  .metrics-card-grid {
    margin: 0 4% 20px;
    width: calc(100% - 8%);
  }
}

@media (min-width: 1025px) and (max-width: 1439px) {

  .weather-card-grid,
  .metrics-card-grid {
    margin: 0 3% 20px;
    width: calc(100% - 6%);
  }
}

@media (max-width: 1024px) {

  .weather-card-grid,
  .metrics-card-grid {
    flex-direction: column;
    margin: 0 20px 20px;
    width: calc(100% - 40px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .home {
    transition: none;
  }
}
</style>
