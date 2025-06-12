<script>
import { useUserStore } from '@/stores/userStore';
import { mapState } from 'pinia';

export default {
  name: 'Navbar',
  data() {
    return {
      menuActive: false
    };
  },
  computed: {
    ...mapState(useUserStore, ['user']),
    isAuthenticated() {
      return !!this.user?.id;
    }
  },
  methods: {
    toggleMenu() {
      this.menuActive = !this.menuActive;
    },
    logout() {
      const store = useUserStore();
      store.logout();
      this.$router.push('/login');
    }
  }
};
</script>

<template>
  <nav class="navbar">
    <div class="navbar-container">
      <!-- Logo -->
      <router-link to="/" class="navbar-logo">
        How's The Weather?
      </router-link>

      <!-- Menu autenticado -->
      <div class="navbar-menu" :class="{ 'active': menuActive }">
        <template v-if="isAuthenticated">
          <router-link to="/settings" class="nav-item">Settings</router-link>
          <button class="nav-btn logout-btn" @click="logout">Logout</button>
        </template>

        <!-- Menu não autenticado -->
        <template v-else>
          <router-link to="/login" class="nav-btn login-btn">Login</router-link>
          <router-link to="/signup" class="nav-btn signup-btn">Sign Up</router-link>
        </template>
      </div>

      <!-- Ícone de menu para mobile -->
      <div class="menu-icon" @click="toggleMenu">
        <div class="bar"></div>
        <div class="bar"></div>
        <div class="bar"></div>
      </div>
    </div>
  </nav>
</template>
<style scoped>
.navbar {
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 40px;
  max-width: 1200px;
  margin: 0 auto;
}

.navbar-logo {
  font-size: 20px;
  font-weight: 700;
  color: #141E46;
  text-decoration: none;
}

.navbar-menu {
  display: flex;
  align-items: center;
  gap: 20px;
}

.nav-item {
  text-decoration: none;
  color: #2c3e50;
  font-weight: 500;
  font-size: 16px;
  transition: color 0.3s;
}

.nav-item:hover {
  color: #41B06E;
}

.nav-auth {
  display: flex;
  gap: 10px;
  margin-left: 20px;
}

.nav-btn {
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s;
}

.login-btn {
  background-color: transparent;
  color: #41B06E;
  border: 1px solid #41B06E;
}

.login-btn:hover {
  background-color: #f0faf5;
}

.signup-btn {
  background-color: #41B06E;
  color: white;
  border: 1px solid #41B06E;
}

.signup-btn:hover {
  background-color: #309659;
}

.menu-icon {
  display: none;
  cursor: pointer;
}

.bar {
  width: 25px;
  height: 3px;
  background-color: #141E46;
  margin: 5px 0;
  transition: 0.4s;
}

@media (max-width: 768px) {
  .navbar-container {
    padding: 15px 20px;
  }
  
  .navbar-menu {
    position: fixed;
    top: 60px;
    left: 0;
    width: 100%;
    background-color: white;
    flex-direction: column;
    align-items: flex-start;
    padding: 20px;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
    transform: translateY(-150%);
    transition: transform 0.3s;
  }
  
  .navbar-menu.active {
    transform: translateY(0);
  }
  
  .nav-auth {
    margin-left: 0;
    width: 100%;
    margin-top: 15px;
  }
  
  .nav-btn {
    width: 100%;
    text-align: center;
  }
  
  .menu-icon {
    display: block;
  }
}
</style>