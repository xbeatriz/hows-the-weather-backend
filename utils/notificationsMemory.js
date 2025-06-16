// backend/utils/notificationsMemory.js

const notifications = [];

function addNotification(notification) {
  notifications.push(notification);
}

function getNotifications() {
  return notifications;
}

export { addNotification, getNotifications };
