<template>
  <nav class="navbar">
    <div class="navbar-container">
      <div class="navbar-logo">
        <h1>How's The Weather</h1>
      </div>
      <div class="navbar-links">
        <a href="#home">Home</a>
        <a href="#features">Features</a>
        <a href="#about">About</a>
        <a href="#contact">Contact</a>
      </div>
      <div class="navbar-mobile-toggle" @click="toggleMobileMenu">
        <div class="bar"></div>
        <div class="bar"></div>
        <div class="bar"></div>
      </div>
    </div>
    <div class="mobile-menu" :class="{ 'active': mobileMenuActive }">
      <a href="#home" @click="closeMobileMenu">Home</a>
      <a href="#features" @click="closeMobileMenu">Features</a>
      <a href="#about" @click="closeMobileMenu">About</a>
      <a href="#contact" @click="closeMobileMenu">Contact</a>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'Navbar',
  data() {
    return {
      mobileMenuActive: false
    }
  },
  methods: {
    toggleMobileMenu() {
      this.mobileMenuActive = !this.mobileMenuActive;
    },
    closeMobileMenu() {
      this.mobileMenuActive = false;
    }
  }
}
</script>

<style scoped>
/* Navbar Styles */
.navbar {
  background-color: #2c3e50;
  color: white;
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 1000;
  height: 60px; /* Fixed height for consistent spacing */
}

.navbar-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 5%;
}

.navbar-logo h1 {
  font-size: 24px;
  cursor: pointer;
  margin: 0;
}

.navbar-links {
  display: flex;
}

.navbar-links a {
  color: white;
  text-decoration: none;
  margin-left: 24px;
  transition: color 0.3s;
  font-size: 16px;
}

.navbar-links a:hover {
  color: #3498db;
}

.navbar-mobile-toggle {
  display: none;
  cursor: pointer;
}

.bar {
  width: 25px;
  height: 3px;
  background-color: white;
  margin: 5px 0;
  transition: 0.4s;
}

.mobile-menu {
  display: none;
  flex-direction: column;
  background-color: #2c3e50;
  width: 100%;
  text-align: center;
  padding: 16px 0;
  transform: translateY(-100%);
  transition: transform 0.3s ease-in-out;
}

.mobile-menu.active {
  transform: translateY(0);
  display: flex;
}

.mobile-menu a {
  color: white;
  text-decoration: none;
  padding: 16px 0;
  transition: color 0.3s;
}

.mobile-menu a:hover {
  color: #3498db;
}

/* Responsive Design for Navbar */
@media (max-width: 768px) {
  .navbar-links {
    display: none;
  }

  .navbar-mobile-toggle {
    display: block;
  }
}
</style>
