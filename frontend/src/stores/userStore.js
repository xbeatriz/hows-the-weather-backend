import { defineStore } from 'pinia';

export const useUserStore = defineStore('userStore', {
  state: () => ({
    user: null,
    accessToken: '',
    refreshToken: '',
  }),

  actions: {
    loadFromStorage() {
      const storedUser = localStorage.getItem('user');
      const storedAccessToken = localStorage.getItem('accessToken');
      const storedRefreshToken = localStorage.getItem('refreshToken');

      if (storedUser) this.user = JSON.parse(storedUser);
      if (storedAccessToken) this.accessToken = storedAccessToken;
      if (storedRefreshToken) this.refreshToken = storedRefreshToken;
    },

    setUserData(user, accessToken, refreshToken) {
      this.user = user;
      this.accessToken = accessToken;
      this.refreshToken = refreshToken;

      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
    },

    logout() {
      this.user = null;
      this.accessToken = '';
      this.refreshToken = '';

      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  }
});
