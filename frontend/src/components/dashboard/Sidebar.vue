<template>
  <div class="sidebar">
    <div class="logo-container">
      <h1>{{ headerText }}</h1>
    </div>

    <div class="user-profile">
      <img :src="user.avatar" :alt="user.name" class="user-avatar" />
      <div class="user-info">
        <h3>{{ user.name }}</h3>
        <p>{{ user.role }}</p>
      </div>
    </div>

    <nav class="sidebar-nav">
      <ul>
        <li v-for="item in menuItems" :key="item.id" @click="selectMenu(item.id)"
          :class="{ active: activeMenu === item.id }">
          <font-awesome-icon :icon="item.icon" /> {{ item.name }}
        </li>
      </ul>
    </nav>

    <div class="sidebar-footer">
      <button class="settings-btn" @click="openSettings()">
        <font-awesome-icon :icon="['fas', 'cog']" /> Settings
      </button>
      <button class="logout-btn" @click="logout">
        <font-awesome-icon :icon="['fas', 'sign-out-alt']" /> Log Out
      </button>
    </div>
  </div>
</template>


<script>
import router from '@/router';
import { computed } from 'vue';
import { useUserStore } from '@/stores/userStore';

export default {
  name: "Sidebar",
  props: {
    user: {
      type: Object,
      default: () => ({
        name: "Guest User",
        role: "Visitor",
        avatar: "https://via.placeholder.com/50",
      }),
    },
    activeMenu: {
      type: String,
      default: "overview",
    },
    headerText: {
      type: String,
      default: "Weather Admin",
    },
  },
  methods: {
    selectMenu(menuItem) {
      this.$emit("menuChange", menuItem);
    },
    logout() {
      this.$emit("logout");
    },
    openSettings() {
      router.push({ name: 'Settings' });
    },
  },
  setup() {
    const userStore = useUserStore();
    const user = userStore.user;

    const menuItems = computed(() => {
      const items = [
        { id: "overview", name: "Overview", icon: ["fas", "tachometer-alt"] },
        { id: "sensors", name: "Sensors", icon: ["fas", "microchip"] },
        { id: "communities", name: "Communities", icon: ["fas", "city"] },
      ];

      if (user.role === "admin") {
        items.splice(2, 0, { id: "users", name: "Users", icon: ["fas", "users"] });
        items.push({ id: "pendingPosts", name: "Verificar Posts", icon: ["fas", "check-circle"] });
      }

      return items;
    });

    return {
      user,
      menuItems,
    };
  },
};
</script>


<style scoped>
.sidebar {
  width: 260px;
  min-width: 260px;
  /* Fixed width */
  flex: 0 0 260px;
  /* Don't grow, don't shrink, fixed basis */
  background-color: #141e46;
  color: #fff;
  display: flex;
  flex-direction: column;
  height: 100vh;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  z-index: 10;
  transition: transform 0.3s ease;
}

.logo-container {
  padding: 20px;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo-container h1 {
  font-size: 20px;
  font-weight: 700;
  color: #41b06e;
}

.user-profile {
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.user-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}

.user-info h3 {
  font-size: 16px;
  margin: 0;
  font-weight: 600;
}

.user-info p {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  margin: 5px 0 0;
}

.sidebar-nav {
  flex: 1;
  padding: 20px 0;
}

.sidebar-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar-nav li {
  padding: 12px 25px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 15px;
}

.sidebar-nav li i {
  width: 20px;
  text-align: center;
}

.sidebar-nav li:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.sidebar-nav li.active {
  background-color: #41b06e;
  font-weight: 600;
}

.sidebar-footer {
  padding: 15px 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.settings-btn,
.logout-btn {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 14px;
  transition: all 0.2s;
}

.settings-btn {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
}

.settings-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.logout-btn {
  background-color: rgba(255, 0, 0, 0.2);
  color: white;
}

.logout-btn:hover {
  background-color: rgba(255, 0, 0, 0.3);
}

/* Media query for mobile devices */
@media screen and (max-width: 768px) {
  .sidebar {
    position: fixed;
    transform: translateX(-100%);
  }

  .sidebar.active {
    transform: translateX(0);
  }
}
</style>
