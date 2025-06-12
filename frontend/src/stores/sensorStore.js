// src/stores/sensorStore.js
import { defineStore } from 'pinia';

export const useSensorStore = defineStore('sensorStore', {
  state: () => ({
    sensors: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchSensors(token) {
      this.loading = true;
      this.error = null;

      try {
        const res = await fetch('/api/sensors', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });

        if (!res.ok) {
          const errText = await res.text();
          throw new Error(`Erro ${res.status}: ${errText}`);
        }

        const data = await res.json();
        this.sensors = data;
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },

    clearSensors() {
      this.sensors = [];
      this.error = null;
      this.loading = false;
    }
  }
});
