<template>
  <div class="landing-page">
    <!-- Use the Navbar component -->
    <Navbar />

    <!-- Hero Section -->
    <div id="home" class="hero-section">
      <div class="hero-content">
        <h1>Check the Weather Anywhere</h1>
        <p>Get accurate and real-time weather forecasts for any location</p>
        <div class="search-container">
          <input
            type="text"
            placeholder="Enter city name..."
            v-model="searchQuery"
            @keyup.enter="searchWeather"
          />
          <button @click="searchWeather">Search</button>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <div id="features" class="features-section">
      <h2>Features</h2>
      <div class="features-container">
        <div class="feature-card">
          <div class="feature-icon">🌦️</div>
          <h3>Real-time Forecasts</h3>
          <p>Get up-to-date weather information for any location worldwide</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">📱</div>
          <h3>Acessible everywhere</h3>
          <p>
            Access weather data on any device with our mobile-friendly interface
          </p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">🔍</div>
          <h3>Detailed Analysis</h3>
          <p>
            View comprehensive weather data including temperature, humidity, and
            wind speed
          </p>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-section">
          <h3>How's The Weather</h3>
          <p>Your reliable source for weather forecasts worldwide</p>
        </div>
        <div class="footer-section" id="contact">
          <h3>Contact Us</h3>
          <p>Email: howstheweather.sup@gmail.com</p>
        </div>
      </div>
      <div class="footer-bottom">
        <p>
          &copy; {{ new Date().getFullYear() }} How's The Weather. All Rights
          Reserved.
        </p>
      </div>
    </footer>
  </div>
</template>

<script>
// Import Navbar component
import Navbar from "@/components/Navbar.vue";

export default {
  name: "LandingPageView",
  // Register the Navbar component
  components: {
    Navbar,
  },
  data() {
    return {
      searchQuery: "",
    };
  },
  methods: {
    searchWeather() {
      if (this.searchQuery.trim()) {
        // Add your weather search logic here
        console.log(`Searching weather for: ${this.searchQuery}`);
        // You can redirect to a weather details page or show results
        // this.$router.push({ name: 'WeatherDetails', params: { city: this.searchQuery } });
      }
    },
  },
};
</script>

<style scoped>
/* Reset and base styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Landing page container */
.landing-page {
  font-family: "Arial", sans-serif;
  color: #141e46;
  width: 100%;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  overflow-x: hidden;
}

/* Hero Section */
.hero-section {
  min-height: 100vh;
  width: 100%;
  background-color: #141e46;
  background-image: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),
    url("https://images.unsplash.com/photo-1534088568595-a066f410bcda?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1951&q=80");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: white;
}

/* Features Section */
.features-section {
  padding: 80px 0;
  text-align: center;
  background-color: #f9f9f9;
  width: 100%;
}

/* Footer */
.footer {
  background-color: #141e46;
  color: white;
  padding: 48px 0 16px;
  width: 100%;
}

.hero-content {
  max-width: 800px;
  padding: 32px;
}

.hero-content h1 {
  font-size: 48px;
  margin-bottom: 16px;
}

.hero-content p {
  font-size: 19px;
  margin-bottom: 32px;
}

.search-container {
  display: flex;
  justify-content: center;
  max-width: 500px;
  margin: 0 auto;
}

.search-container input {
  flex: 1;
  padding: 13px;
  border: none;
  outline: none;
  border-radius: 4px 0 0 4px;
  font-size: 16px;
}

.search-container button {
  padding: 13px 19px;
  background-color: #41b06e;
  color: white;
  border: none;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.search-container button:hover {
  background-color: #142a83ff;
}

/* Features Section Styles */
.features-section {
  padding: 80px 0;
  text-align: center;
  background-color: #f9f9f9;
  width: 100%;
}

.features-section h2 {
  font-size: 40px;
  margin-bottom: 48px;
  position: relative;
  padding: 0 32px;
}

.features-section h2:after {
  content: "";
  position: absolute;
  bottom: -15px;
  left: 50%;
  transform: translateX(-50%);
  width: 50px;
  height: 3px;
  background-color: #41b06e;
}

.features-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 32px;
  max-width: 1200px;
  margin: 0 auto;
}

.feature-card {
  flex: 1;
  min-width: 300px;
  background-color: white;
  border-radius: 8px;
  padding: 32px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.feature-card:hover {
  transform: translateY(-10px);
}

.feature-icon {
  font-size: 48px;
  margin-bottom: 24px;
}

.feature-card h3 {
  font-size: 24px;
  margin-bottom: 16px;
}

.feature-card p {
  color: #666;
  line-height: 1.6;
}

/* Footer Styles */
.footer {
  background-color: #141e46;
  color: white;
  padding: 48px 0 16px;
  width: 100%;
}

.footer-content {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  gap: 32px;
}

.footer-section {
  flex: 1;
  min-width: 250px;
}

.footer-section h3 {
  font-size: 21px;
  margin-bottom: 24px;
  position: relative;
}

.footer-section h3:after {
  content: "";
  position: absolute;
  bottom: -10px;
  left: 0;
  width: 30px;
  height: 2px;
  background-color: #41b06e;
}

.footer-section p {
  margin-bottom: 13px;
}

.footer-section ul {
  list-style: none;
}

.footer-section ul li {
  margin-bottom: 8px;
}

.footer-section ul li a {
  color: #ccc;
  text-decoration: none;
  transition: color 0.3s;
}

.footer-section ul li a:hover {
  color: #3498db;
}

.footer-bottom {
  text-align: center;
  padding-top: 32px;
  margin-top: 32px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

/* Responsive Design */
@media (max-width: 768px) {
  .navbar-links {
    display: none;
  }

  .navbar-mobile-toggle {
    display: block;
  }

  .hero-content h1 {
    font-size: 37px;
  }

  .search-container {
    flex-direction: column;
  }

  .search-container input {
    border-radius: 4px 4px 0 0;
  }

  .search-container button {
    border-radius: 0 0 4px 4px;
  }

  .feature-card {
    min-width: 100%;
  }

  .footer-section {
    min-width: 100%;
    margin-bottom: 32px;
  }

  .hero-section {
    height: 100vh;
    padding: 24px;
    margin: 0;
  }
}
</style>
