<template>
  <div class="p-4 max-w-lg mx-auto">
    <h2 class="text-2xl font-semibold mb-4">Criar Nova Publicação</h2>

    <form @submit.prevent="submitPost" class="space-y-4">
      <div>
        <label for="description" class="block font-medium mb-1">Descrição</label>
        <textarea
          id="description"
          v-model="description"
          rows="4"
          class="w-full border rounded px-3 py-2"
          placeholder="Descreva a situação..."
          required
        ></textarea>
      </div>

      <div>
        <label for="tags" class="block font-medium mb-1">Tags (separadas por vírgula)</label>
        <input
          id="tags"
          type="text"
          v-model="tagsInput"
          placeholder="ex: temperature, alert"
          class="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label for="mediaUrl" class="block font-medium mb-1">URL da Imagem/Vídeo</label>
        <input
          id="mediaUrl"
          type="url"
          v-model="mediaUrl"
          placeholder="https://exemplo.com/imagem.jpg"
          class="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label for="mediaType" class="block font-medium mb-1">Tipo de Mídia</label>
        <select id="mediaType" v-model="mediaType" class="w-full border rounded px-3 py-2">
          <option value="image">Imagem</option>
          <option value="video">Vídeo</option>
        </select>
      </div>

      <button
        type="submit"
        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        :disabled="loading"
      >
        {{ loading ? 'A enviar...' : 'Enviar Publicação' }}
      </button>

      <p v-if="successMessage" class="text-green-600 mt-2">{{ successMessage }}</p>
      <p v-if="errorMessage" class="text-red-600 mt-2">{{ errorMessage }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { useCommunityStore } from '@/stores/communityStore'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const communityStore = useCommunityStore()
const router = useRouter()

const description = ref('')
const tagsInput = ref('')
const mediaUrl = ref('')
const mediaType = ref('image')
const loading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

async function submitPost() {
  errorMessage.value = ''
  successMessage.value = ''
  
  // Validar descrição
  if (!description.value.trim()) {
    errorMessage.value = 'A descrição é obrigatória.'
    return
  }

  loading.value = true

  try {
    // Obter comunidade do utilizador
    const community = communityStore.community
    if (!community) {
      throw new Error('Comunidade não encontrada para a sua localização.')
    }

    // Preparar dados do post
    const postPayload = {
      post_id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(), // id temporário
      user_id: userStore.user.id,
      sensor_id: userStore.user.configs?.[0]?.sensorid || null,
      description: description.value.trim(),
      media: mediaUrl.value
        ? [{ type: mediaType.value, url: mediaUrl.value.trim() }]
        : [],
      timestamp: new Date().toISOString(),
      tags: tagsInput.value
        ? tagsInput.value.split(',').map(t => t.trim()).filter(t => t.length > 0)
        : [],
      status: 'waiting'
    }

    // Fazer POST usando fetch
    const response = await fetch(
      `http://localhost:3000/api/communities/${community._id}/posts`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userStore.token}` // Assumindo que o token está no userStore
        },
        body: JSON.stringify(postPayload)
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Erro ao criar publicação.')
    }

    successMessage.value = 'Publicação enviada com sucesso e aguarda aprovação.'
    description.value = ''
    tagsInput.value = ''
    mediaUrl.value = ''
    mediaType.value = 'image'

    // Opcional: redirecionar ou atualizar lista posts
    // router.push('/community') // Exemplo

  } catch (err) {
    errorMessage.value = err.message || 'Erro desconhecido.'
  } finally {
    loading.value = false
  }
}
</script>
