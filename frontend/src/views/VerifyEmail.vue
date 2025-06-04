<template>
  <div class="verify-email-page">
    <h1 class="text-2xl font-bold mb-4">Verificar E-mail</h1>
    <p v-if="loading">A verificar o teu email...</p>
    <p v-if="success" class="text-green-600">✅ Email verificado com sucesso!</p>
    <p v-if="error" class="text-red-600">❌ {{ error }}</p>
  </div>
</template>

<script>
export default {
  name: 'VerifyEmail',
  data() {
    return {
      loading: true,
      success: false,
      error: null
    };
  },
  async mounted() {
    const token = this.$route.params.token;

    try {
      const response = await fetch(`http://localhost:5000/api/verify-email/${token}`);
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Erro ao verificar o email.');
      }
      this.success = true;
    } catch (err) {
      this.error = err.message;
    } finally {
      this.loading = false;
    }
  }
};
</script>

<style scoped>
.verify-email-page {
  max-width: 600px;
  margin: 2rem auto;
  padding: 1.5rem;
  text-align: center;
}
</style>
