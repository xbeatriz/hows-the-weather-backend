<template>
  <div class="home">
    <Navbar />
    <div class="hero-section">
      <div class="hero-content">
        <h1>How's the Weather?</h1>
        <p>Get real-time weather information from our community-driven network of weather sensors.</p>
        <div class="hero-buttons">
          <router-link to="/login" class="btn btn-primary">Login</router-link>
          <router-link to="/signup" class="btn btn-secondary">Sign Up</router-link>
        </div>
      </div>
      <div class="hero-image">
        <img src="@/assets/Dayflowchill.png" alt="Weather Illustration" />
      </div>
    </div>

    <div class="features-section">
      <h2>Our Features</h2>
      <div class="feature-cards">
        <div class="feature-card">
          <div class="icon">🌡️</div>
          <h3>Real-time Data</h3>
          <p>Access weather data from sensors in your community in real-time.</p>
        </div>
        <div class="feature-card">
          <div class="icon">🌍</div>
          <h3>Community Driven</h3>
          <p>Join communities of weather enthusiasts in your region.</p>
        </div>
        <div class="feature-card">
          <div class="icon">📊</div>
          <h3>Data Analysis</h3>
          <p>View historical data and trends with our analytics tools.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue'

export default {
  name: 'HomeView',
  components: {
    Navbar
  }
}
</script>

<style scoped>
.home {
  min-height: 100vh;
}

.hero-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 40px 80px;
  background-color: #f5f7fa;
}

.hero-content {
  max-width: 500px;
}

.hero-content h1 {
  font-size: 42px;
  font-weight: 700;
  margin-bottom: 20px;
  color: #141E46;
}

.hero-content p {
  font-size: 18px;
  line-height: 1.6;
  color: #4a5568;
  margin-bottom: 30px;
}

.hero-buttons {
  display: flex;
  gap: 15px;
}

.btn {
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: 600;
  text-decoration: none;
  text-align: center;
  transition: all 0.3s;
}

.btn-primary {
  background-color: #41B06E;
  color: white;
}

.btn-primary:hover {
  background-color: #309659;
}

.btn-secondary {
  background-color: white;
  color: #41B06E;
  border: 1px solid #41B06E;
}

.btn-secondary:hover {
  background-color: #f8f9fa;
}

.hero-image img {
  max-width: 100%;
  max-height: 400px;
}

.features-section {
  padding: 60px 80px;
  text-align: center;
}

.features-section h2 {
  font-size: 32px;
  margin-bottom: 40px;
  color: #141E46;
}

.feature-cards {
  display: flex;
  gap: 30px;
  justify-content: center;
}

.feature-card {
  background-color: white;
  border-radius: 10px;
  padding: 30px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  max-width: 300px;
  transition: transform 0.3s;
}

.feature-card:hover {
  transform: translateY(-10px);
}

.feature-card .icon {
  font-size: 40px;
  margin-bottom: 20px;
}

.feature-card h3 {
  font-size: 20px;
  margin-bottom: 15px;
  color: #141E46;
}

.feature-card p {
  color: #4a5568;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .hero-section {
    flex-direction: column;
    text-align: center;
    padding: 40px 20px;
  }

  .hero-content {
    margin-bottom: 40px;
  }

  .hero-buttons {
    justify-content: center;
  }

  .features-section {
    padding: 40px 20px;
  }

  .feature-cards {
    flex-direction: column;
    align-items: center;
  }
}
</style>
