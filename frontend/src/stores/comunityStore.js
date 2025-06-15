import { defineStore } from 'pinia'
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
        const res = await fetch('http://localhost:3000/api/communities', {
          headers: {
            Authorization: `Bearer ${userStore.accessToken}`
          }
        })

        if (!res.ok) throw new Error('Erro ao buscar comunidades')

        const data = await res.json()
        this.communities = data.data.communities || []  // <-- ajuste aqui

        const location = userStore.user?.location
        this.userCommunity = this.communities.find(c => c.location === location) || null
      } catch (error) {
        console.error('Erro ao buscar comunidades:', error)
      }
    }
    ,

    async createCommunity(location, token) {
      try {
        const userStore = useUserStore()

        const res = await fetch('http://localhost:3000/api/communities', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userStore.accessToken}`
          },
          body: JSON.stringify({ location })
        })

        if (!res.ok) throw new Error('Erro ao criar comunidade')

        const data = await res.json()
        this.communities.push(data.data)
        return true
      } catch (error) {
        console.error('Erro ao criar comunidade:', error)
        return false
      }
    }
  }
})
