import { defineStore } from "pinia";

export const useNotificationStore = defineStore("notification", {
  state: () => ({
    notifications: [],
  }),
  actions: {
    addNotification(notification) {
      this.notifications.push({
        ...notification,
        id: Date.now(), // ID local
        read: false,
      });
    },
    markAsRead(id) {
      const notif = this.notifications.find(n => n.id === id);
      if (notif) notif.read = true;
    },
    clearAll() {
      this.notifications = [];
    },
  },
});
