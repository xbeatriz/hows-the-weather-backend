<template>
  <div class="settings-container">
    <h2>Criar Sensor</h2>
    <form @submit.prevent="createSensor">
      <div class="form-group">
        <label>Tipo</label>
        <select v-model="form.type">
          <option value="temperature">Temperature</option>
          <option value="humidity">Humidity</option>
          <option value="gas">Gas</option>
        </select>
      </div>
      <div class="form-group">
        <label>Localização</label>
        <input type="text" v-model="form.location" required />
      </div>
      <div class="form-group">
        <label>Status</label>
        <select v-model="form.status">
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
      <div class="form-group">
        <label>Frequência de Atualização</label>
        <select v-model="form.update_frequency">
          <option value="hours">Hours</option>
          <option value="daily">Daily</option>
        </select>
      </div>
      <button type="submit" class="save-btn">Criar</button>
    </form>
  </div>
</template>

<script>
import { useUserStore } from '@/stores/userStore';

export default {
  data() {
    return {
      form: {
        type: '',
        location: '',
        status: '',
        update_frequency: ''
      }
    }
  },
  methods: {
    async createSensor() {
      const token = useUserStore().token;
      const res = await fetch('http://localhost:3000/api/sensors', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.form)
      });
      const data = await res.json();
      console.log(data);
    }
  }
}
</script>
