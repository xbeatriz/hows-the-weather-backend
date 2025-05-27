import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

// Create a simple icon component as a temporary replacement for Font Awesome
app.component('font-awesome-icon', {
  props: ['icon'],
  template: `<span class="icon-placeholder">{{ icon[1] }}</span>`,
})

// Temporary solution until Font Awesome is installed
const iconClasses = {
  'fa-users': 'users',
  'fa-microchip': 'microchip',
  'fa-city': 'city',
  'fa-tachometer-alt': 'tachometer-alt',
  'fa-sync': 'sync',
  'fa-sign-out-alt': 'sign-out-alt',
  'fa-cog': 'cog',
  'fa-edit': 'edit',
  'fa-trash': 'trash',
  'fa-chart-line': 'chart-line',
  'fa-map-marker-alt': 'map-marker-alt',
  'fa-search': 'search',
  'fa-plus': 'plus',
  'fa-chevron-left': 'chevron-left',
  'fa-chevron-right': 'chevron-right',
  'fa-signal': 'signal',
  'fa-info-circle': 'info-circle',
  'fa-user': 'user'
};

app.mixin({
  computed: {
    fas() {
      return iconClasses;
    }
  }
})

app.use(createPinia())
app.use(router)

app.mount('#app')
