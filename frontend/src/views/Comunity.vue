<template>
  <div class="p-4">
    <h2 class="text-2xl font-semibold mb-4">Comunidade: {{ community?.location }}</h2>

    <div v-if="loading" class="text-gray-500">A carregar comunidade...</div>
    <div v-else-if="error" class="text-red-500">{{ error }}</div>

    <div v-else-if="!community">
      <p>Não foi possível encontrar a comunidade para a sua localização.</p>
    </div>

    <div v-else>
      <p class="text-gray-600 mb-4">Número de membros: {{ community.members_count }}</p>

      <div v-if="posts.length === 0">
        <p class="text-gray-500">Ainda não há publicações aprovadas nesta comunidade.</p>
      </div>

      <div class="space-y-4">
        <div
          v-for="post in posts"
          :key="post.post_id"
          class="bg-white p-4 rounded-lg shadow border"
        >
          <p class="text-gray-800 mb-2">{{ post.description }}</p>

          <div class="flex flex-wrap gap-2 mb-2">
            <span
              v-for="tag in post.tags"
              :key="tag"
              class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
            >
              #{{ tag }}
            </span>
          </div>

          <div class="flex flex-wrap gap-3 mb-2">
            <template v-for="mediaItem in post.media" :key="mediaItem.url">
              <img
                v-if="mediaItem.type === 'image'"
                :src="mediaItem.url"
                alt="imagem do post"
                class="w-32 h-32 object-cover rounded"
              />
              <video
                v-else-if="mediaItem.type === 'video'"
                controls
                class="w-32 h-32 rounded"
              >
                <source :src="mediaItem.url" type="video/mp4" />
                O vídeo não é suportado.
              </video>
            </template>
          </div>

          <p class="text-sm text-gray-400">
            Publicado em {{ formatDate(post.timestamp) }} • {{ post.likes }} ❤️
          </p>
        </div>
      </div>
    </div>

    <!-- Exemplo de botão para criar post -->
    <div class="mt-6">
      <RouterLink
        to="/criar-publicacao"
        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Criar nova publicação
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useCommunityStore } from '@/stores/communityStore'

const communityStore = useCommunityStore()

const { community, posts, loading, error } = communityStore

onMounted(() => {
  communityStore.fetchCommunityByUserLocation()
})

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleString('pt-PT', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>
