<template>
  <div class="settings-container">
    <h2>Criar Comunidade</h2>
    <form @submit.prevent="createCommunity">
      <div class="form-group">
        <label>Localização</label>
        <input type="text" v-model="form.location" required />
      </div>
      <div class="form-group">
        <label>Número de Membros</label>
        <input type="number" v-model.number="form.members_count" required />
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
        location: '',
        members_count: 0
      }
    }
  },
  methods: {
    async createCommunity() {
      const token = useUserStore().token;
      const res = await fetch('http://localhost:3000/api/communities', {
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
