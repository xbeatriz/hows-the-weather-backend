<template>
  <nav class="navbar">
    <div class="navbar-container">
      <div class="navbar-logo">
        <router-link to="/" class="logo-link">
          <h1>How's The Weather</h1>
        </router-link>
      </div>
      <div class="navbar-links">
        <a href="#home">Home</a>
        <a href="#features">Features</a>
        <a href="#about">About</a>
        <a href="#contact">Contact</a>
        <router-link to="/login" class="btn-login">Login</router-link>
        <router-link to="/signup" class="btn-singup">Sing Up</router-link>
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
      <a href="#login" @click="closeMobileMenu" class="btn-login mobile">Login</a>
      <a href="#signup" @click="closeMobileMenu" class="btn-signup mobile">Sign Up</a>
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
/* Core Layout */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  width: 100%;
  background: #141E46;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  transition: background 0.3s ease;
}

.navbar-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 2rem;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* Logo */
.navbar-logo h1 {
  font-size: 22px;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: 0.5px;
  margin: 0;
  background: linear-gradient(to right, #ffffff, #cce0ff);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

.logo-link {
  text-decoration: none;
  display: block;
}

/* Nav Links */
.navbar-links {
  display: flex;
  align-items: center;
}

.navbar-links a {
  text-decoration: none;
  color: #e0e0e0;
  margin-left: 32px;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.7px;
  transition: color 0.25s ease;
  position: relative;
}

.navbar-links a:hover {
  color: #8DECB4;
}


/* CTA Buttons */
.btn-login,
.btn-signup {
  margin-left: 20px;
  padding: 8px 18px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.6px;
  transition: all 0.3s ease;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* Login (Outline) */
.btn-login {
  padding: 8px 16px;
  background-color: #41B06E;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
  color: #ffffff;
}

.btn-login:hover {
  background-color: #309659FF;
}

/* Signup (Primary) */
.btn-signup {

  color: #ffffff;
  border: 2px solid #41B06E;
}

.btn-signup:hover {
  background-color: #41B06E;
  transform: translateY(-1px);
}

/* Mobile Menu Toggle */
.navbar-mobile-toggle {
  display: none;
  flex-direction: column;
  cursor: pointer;
  gap: 4px;
}

.burger {
  width: 24px;
  height: 2.5px;
  background: white;
  border-radius: 2px;
  transition: 0.3s;
}

/* Mobile Menu */
.mobile-menu {
  display: none;
  flex-direction: column;
  align-items: center;
  background: #1e2a38;
  width: 100%;
  padding: 20px 0;
  position: absolute;
  top: 72px;
  left: 0;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
  transform: translateY(-100%);
  transition: transform 0.3s ease-in-out;
}

.mobile-menu.active {
  transform: translateY(0);
  display: flex;
}

.mobile-menu a {
  padding: 12px 0;
  color: white;
  font-weight: 600;
  font-size: 15px;
  text-decoration: none;
  transition: color 0.3s ease;
}

.mobile-menu a:hover {
  color: #4da8da;
}

/* Mobile Buttons */
.mobile-menu .btn-login.mobile,
.mobile-menu .btn-signup.mobile {
  margin: 12px 40px;
  width: calc(100% - 80px);
  padding: 10px 0;
  text-align: center;
}

/* Login Button */
.login-button {
  padding: 8px 16px;
  background-color: #41B06E;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
}

.login-button:hover {
  background-color: #309659FF;
  color: white;
}

/* Responsive Breakpoint */
@media (max-width: 768px) {
  .navbar-links {
    display: none;
  }

  .navbar-mobile-toggle {
    display: flex;
  }

  .mobile-menu {
    top: 72px;
  }

  .navbar-logo h1 {
    font-size: 18px;
  }
}
</style>

