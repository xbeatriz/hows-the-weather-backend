<template>
  <div class="signup-view">
    <Navbar />
    <div class="login-container">
      <div class="login-card">
        <div class="login-form-section">
          <h1>Sign Up</h1>
          <p class="subtitle">Already have an account? <router-link to="/login">Login</router-link></p>

          <div class="form-group">
            <label for="name">Full Name</label>
            <input type="text" id="name" v-model="name" placeholder="John Doe" />
          </div>

          <div class="form-group">
            <label for="email">Email Address</label>
            <input type="email" id="email" v-model="email" placeholder="you@example.com" />
          </div>
          <div class="form-group">
            <label for="location">Localização</label>
            <select id="location" v-model="location">
              <option value="" disabled>Selecione sua localização</option>
              <option value="Lisboa">Lisboa</option>
              <option value="Porto">Porto</option>
              <option value="Coimbra">Coimbra</option>
              <option value="Faro">Faro</option>
              <option value="Braga">Braga</option>
            </select>
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" v-model="password" placeholder="Enter 6 character or more" />
          </div>

          <div class="form-group">
            <label for="confirmPassword">Confirm Password</label>
            <input type="password" id="confirmPassword" v-model="confirmPassword" placeholder="Repeat your password" />
          </div>

          <button @click="signUp" class="login-button">SIGN UP</button>
        </div>

        <div class="login-image-section">
          <img src="@/assets/undraw_weather.svg" alt="Sign Up" class="login-illustration" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue'
import { useUserStore } from '@/stores/userStore'

export default {
  name: 'SignUpView',
  components: {
    Navbar
  },
  data() {
    return {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      location: ''
    }
  },
  methods: {
    async signUp() {
      if (this.password !== this.confirmPassword) {
        alert('Passwords do not match!')
        return
      }

      try {
        const response = await fetch('http://localhost:3000/api/user/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: this.name,
            email: this.email,
            password: this.password,
            location: this.location
          })
        })

        if (!response.ok) {
          const errorData = await response.json()
          alert('Erro ao registar: ' + (errorData.message || 'Tente novamente.'))
          return
        }

        // Aqui só mostra mensagem de sucesso para o utilizador
        alert('Registo efetuado! Por favor, verifique seu email para ativar a conta.')

        // Limpar campos para evitar confusão
        this.name = ''
        this.email = ''
        this.password = ''
        this.confirmPassword = ''
        this.location = ''

      } catch (error) {
        alert('Erro na comunicação com o servidor.')
        console.error('Erro no registo:', error)
      }
    }
  }

}
</script>

<style scoped>
/* Reutilização exata do mesmo estilo que forneceste para manter consistência */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.signup-view {
  font-family: 'Arial', sans-serif;
  color: #141E46;
  width: 100%;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  overflow-x: hidden;
}

.login-container {
  width: 100vw;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url('@/assets/wallpaper.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  padding: 20px;
}

.login-card {
  display: flex;
  width: 80%;
  max-width: 1000px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.login-form-section {
  flex: 1;
  padding: 40px;
}

.login-image-section {
  flex: 1;
  background-color: rgb(107, 201, 144);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  overflow: hidden;
}

.login-illustration {
  max-width: 90%;
  max-height: 90%;
  object-fit: contain;
  object-position: center;
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
  color: #141E46;
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

input[type="text"],
input[type="email"],
input[type="password"] {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s;
}

input:focus {
  border-color: #141E46;
  outline: none;
}

.login-button {
  width: 100%;
  padding: 12px;
  background-color: #41B06E;
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
  background-color: #309659FF;
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

select {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s;
}

select:focus {
  border-color: #141E46;
  outline: none;
}

@media (max-width: 768px) {
  .login-card {
    flex-direction: column;
  }

  .login-image-section {
    display: none;
    /* Hide image section on mobile */
  }

  .login-form-section {
    padding: 20px;
  }

  .social-buttons {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .login-container {
    padding: 10px;
  }

  .login-form-section {
    padding: 15px;
  }

  .login-image-section {
    height: 150px;
  }
}
</style>
