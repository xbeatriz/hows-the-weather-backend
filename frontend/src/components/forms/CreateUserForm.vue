<template>
  <div class="settings-container">
    <h2>Criar Utilizador</h2>
    <form @submit.prevent="createUser">
      <div class="form-group">
        <label>Nome</label>
        <input type="text" v-model="form.name" required />
      </div>
      <div class="form-group">
        <label>Email</label>
        <input type="text" v-model="form.email" required />
      </div>
      <div class="form-group">
        <label>Password</label>
        <input type="text" v-model="form.password" required />
      </div>
      <div class="form-group">
        <label>Localização</label>
        <input type="text" v-model="form.location" />
      </div>
      <div class="form-group">
        <label>Tipo</label>
        <select v-model="form.role">
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <button type="submit" class="save-btn">Criar</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        name: '',
        email: '',
        password: '',
        location: '',
        role:"user"
      }
    }
  },
  methods: {
    async createUser() {
      const res = await fetch('http://localhost:3000/api/user/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.form)
      });
      const data = await res.json();
      console.log(data);
    }
  }
}
</script>
