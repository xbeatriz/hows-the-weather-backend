<template>
  <div class="fixed top-5 right-5 z-50 space-y-2">
    <div
      v-for="notif in unreadNotifications"
      :key="notif.id"
      class="bg-white border-l-4 border-blue-500 shadow-lg rounded p-4 max-w-sm"
    >
      <div class="flex justify-between items-start">
        <p class="text-sm text-gray-800">{{ notif.message }}</p>
        <button @click="markAsRead(notif.id)" class="text-gray-400 hover:text-gray-600 text-xs">✕</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useNotificationStore } from "@/stores/notificationStore";
import { computed } from 'vue'


const notificationStore = useNotificationStore();

const unreadNotifications = computed(() =>
  Array.isArray(notificationStore.notifications)
    ? notificationStore.notifications.filter(n => !n.read)
    : []
)

const markAsRead = (id) => {
  notificationStore.markAsRead(id);
};
</script>
