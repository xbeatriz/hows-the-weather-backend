<template>
  <div class="modal-backdrop" @click.self="close">
    <div class="modal-window" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
      <header class="modal-header">
        <h2 id="modalTitle" class="modal-title">{{ title }}</h2>
        <button class="modal-close-btn" @click="close" aria-label="Fechar modal">&times;</button>
      </header>
      <section class="modal-body">
        <slot />
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Modal',
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  emits: ['close'],
  methods: {
    close() {
      this.$emit('close');
    }
  }
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal-window {
  background: white;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 2px 10px rgba(0,0,0,0.3);
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #ddd;
}

.modal-title {
  margin: 0;
  font-size: 1.25rem;
}

.modal-close-btn {
  background: transparent;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  line-height: 1;
  color: #555;
  transition: color 0.2s ease;
}

.modal-close-btn:hover {
  color: #000;
}

.modal-body {
  padding: 1rem 1.5rem;
  overflow-y: auto;
}
</style>
