<template>
  <div id="app">
    <router-view/>
    <AppNotification />
  </div>
</template>

<script>
import AppNotification from "@/components/AppNotification.vue";
export default {
  name: 'App',
  components: {
    AppNotification,
  },
};
</script>

<style>
/* Make sure there are no global styles limiting width */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
  background-color: #f5f7fa;
}

#app {
  width: 100vw;
  min-height: 100vh;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

/* Remove any width constraints that might be added by other CSS */
.container, .container-fluid {
  width: 100%;
  max-width: none;
  margin: 0;
  padding: 0;
}

header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

</style>