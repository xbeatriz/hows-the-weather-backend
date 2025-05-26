<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-form-section">
        <h1>Login</h1>
        <p class="subtitle">Doesn't have an account yet? <router-link to="/signup">Sign Up</router-link></p>
        
        <div class="form-group">
          <label for="email">Email Address</label>
          <input type="email" id="email" v-model="email" placeholder="you@example.com">
        </div>
        
        <div class="form-group">
          <div class="password-header">
            <label for="password">Password</label>
            <a href="#" class="forgot-link">Forgot Password?</a>
          </div>
          <input type="password" id="password" v-model="password" placeholder="Enter 6 character or more">
        </div>
        
        <div class="remember-me">
          <input type="checkbox" id="remember" v-model="rememberMe">
          <label for="remember">Remember me</label>
        </div>
        
        <button @click="login" class="login-button">LOGIN</button>
        
        <div class="or-separator">
          <span>Or login with</span>
        </div>
        
        <div class="social-buttons">
          <button class="google-btn">
            <img src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png" alt="Google">
            Google
          </button>
          <button class="facebook-btn">
            <img src="https://cdn-icons-png.flaticon.com/512/5968/5968764.png" alt="Facebook">
            Facebook
          </button>
        </div>
      </div>
      
      <div class="login-image-section">
        <img src="https://cdn.pixabay.com/photo/2023/03/20/11/03/woman-7864330_1280.png" alt="Login">
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue'

export default {
  name: 'LogInView',
  components: {
    Navbar
  },
  data() {
    return {
      email: '',
      password: '',
      rememberMe: false
    }
  },
  methods: {
    login() {
      // Here you would implement the actual login logic
      console.log('Login attempted with:', this.email);
      // For now we'll just log the attempt
    }
  }
}
</script>

<style scoped>
.login-container {
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #a881eb;
  padding: 20px;
}

.login-card {
  display: flex;
  width: 100%;
  max-width: 900px;
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.login-form-section {
  flex: 1;
  padding: 40px;
}

.login-image-section {
  flex: 1;
  background-color: #f8f9fa;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.login-image-section img {
  max-width: 100%;
  max-height: 400px;
}

h1 {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
}

.subtitle {
  font-size: 14px;
  color: #666;
  margin-bottom: 30px;
}

.subtitle a {
  color: #8a57de;
  text-decoration: none;
  font-weight: 600;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
}

input[type="email"],
input[type="password"] {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s;
}

input[type="email"]:focus,
input[type="password"]:focus {
  border-color: #8a57de;
  outline: none;
  box-shadow: 0 0 0 2px rgba(138, 87, 222, 0.2);
}

.password-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.forgot-link {
  font-size: 12px;
  color: #8a57de;
  text-decoration: none;
}

.remember-me {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.remember-me input {
  margin-right: 8px;
}

.remember-me label {
  font-size: 14px;
  color: #666;
  margin-bottom: 0;
}

.login-button {
  width: 100%;
  padding: 12px;
  background-color: #8a57de;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  text-transform: uppercase;
}

.login-button:hover {
  background-color: #7846c5;
}

.or-separator {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 20px 0;
}

.or-separator::before,
.or-separator::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #ddd;
}

.or-separator span {
  padding: 0 10px;
  color: #777;
  font-size: 12px;
}

.social-buttons {
  display: flex;
  gap: 15px;
}

.google-btn,
.facebook-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background-color: white;
  cursor: pointer;
  transition: background-color 0.2s;
  font-size: 14px;
  gap: 8px;
}

.google-btn:hover,
.facebook-btn:hover {
  background-color: #f8f9fa;
}

.google-btn img,
.facebook-btn img {
  width: 18px;
  height: 18px;
}

@media (max-width: 768px) {
  .login-card {
    flex-direction: column;
  }
  
  .login-image-section {
    order: -1;
    padding: 20px;
  }
  
  .login-form-section {
    padding: 20px;
  }
}
</style>
