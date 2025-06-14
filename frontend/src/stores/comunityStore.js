// stores/communityStore.ts
import { defineStore } from 'pinia'
import axios from 'axios'
import { useUserStore } from './userStore'

export const useCommunityStore = defineStore('community', {
  state: () => ({
    communities: [],
    userCommunity: null,
    communityPosts: [],
  }),

  actions: {
    async fetchAllCommunities() {
      try {
        const userStore = useUserStore()
        const res = await axios.get('http://localhost:3000/api/communities', {
          headers: {
            Authorization: `Bearer ${userStore.token}`
          }
        })
        this.communities = res.data

        // Filtra a comunidade do utilizador
        const location = userStore.user?.location
        this.userCommunity = this.communities.find(c => c.location === location) || null
      } catch (error) {
        console.error('Erro ao buscar comunidades:', error)
      }
    },

    async fetchUserCommunityPosts() {
      try {
        const userStore = useUserStore()
        if (!this.userCommunity?._id) return

        const res = await axios.get(`http://localhost:3000/api/communities/${this.userCommunity._id}/posts`, {
          headers: {
            Authorization: `Bearer ${userStore.token}`
          }
        })
        this.communityPosts = res.data
      } catch (error) {
        console.error('Erro ao buscar posts da comunidade:', error)
      }
    },

    async createPost(postData) {
      try {
        const userStore = useUserStore()
        if (!this.userCommunity?._id) return

        const res = await axios.post(
          `http://localhost:3000/api/communities/${this.userCommunity._id}/posts`,
          postData,
          {
            headers: {
              Authorization: `Bearer ${userStore.token}`,
              'Content-Type': 'application/json'
            }
          }
        )
        // Adiciona o post localmente caso seja necessário
        this.communityPosts.push(res.data)
      } catch (error) {
        console.error('Erro ao criar post:', error)
      }
    },

    async deletePost(postId) {
      try {
        const userStore = useUserStore()
        if (!this.userCommunity?._id) return

        await axios.delete(
          `http://localhost:3000/api/communities/${this.userCommunity._id}/posts/${postId}`,
          {
            headers: {
              Authorization: `Bearer ${userStore.token}`
            }
          }
        )
        // Remove o post localmente
        this.communityPosts = this.communityPosts.filter(p => p.post_id !== postId)
      } catch (error) {
        console.error('Erro ao apagar post:', error)
      }
    }
  }
})
