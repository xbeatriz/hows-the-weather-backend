// stores/userStore.js
import { defineStore } from 'pinia';

export const useUserStore = defineStore('userStore', {
  state: () => ({
  token: localStorage.getItem('token') || null,
  user: JSON.parse(localStorage.getItem('user')) || null
}),

  actions: {
    setUserData(user, token) {
      this.user = user;
      this.token = token;
    },
    logout() {
  this.user = null;
  this.token = null;
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}


  }
});
