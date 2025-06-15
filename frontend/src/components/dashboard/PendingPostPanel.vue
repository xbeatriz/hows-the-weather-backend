<template>
  <div>
    <h2>Posts Pendentes</h2>
    <div v-if="posts.length === 0">Nenhum post pendente.</div>
    <ul v-else>
      <li v-for="post in posts" :key="post.post_id" class="post-item">
        <p><strong>Descrição:</strong> {{ post.description }}</p>
        <p><strong>Tags:</strong> {{ post.tags.join(', ') }}</p>
        <button @click="approvePost(post)">Aprovar</button>
        <button @click="rejectPost(post)">Rejeitar</button>
      </li>
    </ul>
  </div>
</template>

<script>
import { useUserStore } from '@/stores/userStore';

export default {
  props: ['data'],
  computed: {
    posts() {
      return this.data?.pendingPosts || [];
    }
  },
  methods: {
    async approvePost(post) {
      const userStore = useUserStore();
      await fetch(`http://localhost:3000/api/communities/${post.community_id}/posts/${post.post_id}/approve`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${userStore.accessToken}`,
        },
      });
      this.$emit('refresh');
    },
    async rejectPost(post) {
      const userStore = useUserStore();
      await fetch(`http://localhost:3000/api/communities/${post.community_id}/posts/${post.post_id}/reject`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${userStore.accessToken}`,
        },
      });
      this.$emit('refresh');
    }
  }
};
</script>

<style scoped>
.post-item {
  background-color: #f9f9f9; /* fundo claro */
  color: #222; /* texto escuro */
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.5;
}

.post-item p {
  margin: 0.3rem 0;
}

.post-item strong {
  color: #333; /* título em negrito mais escuro */
}

button {
  margin-right: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s ease;
}

button:hover {
  opacity: 0.85;
}

button:first-of-type {
  background-color: #4caf50; /* verde para aprovar */
  color: white;
}

button:last-of-type {
  background-color: #f44336; /* vermelho para rejeitar */
  color: white;
}
</style>
