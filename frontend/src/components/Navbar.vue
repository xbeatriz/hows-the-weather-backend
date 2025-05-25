<template>
  <nav class="navbar">
    <div class="nav-content">
      <div class="logo">Hows The Weather</div>
      <button class="menu-btn" @click="toggleMenu">☰</button>
      <ul :class="['links', { open: isOpen }]">
        <li><router-link to="/login">Login</router-link></li>
        <li><router-link to="/register">Criar Conta</router-link></li>
      </ul>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'Navbar',
  data() {
    return {
      isOpen: false,
    };
  },
  methods: {
    toggleMenu() {
      this.isOpen = !this.isOpen;
    },
  },
};
</script>

<style scoped>

</style>
