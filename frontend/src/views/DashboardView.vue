<template>
  <div class="dashboard-container">
    <Sidebar
      :activeMenu="activeMenu"
      @menuChange="handleMenuChange"
      @logout="handleLogout"
    />
    <div class="dashboard-content">
      <div class="content-header">
        <h1>{{ pageTitle }}</h1>
        <div class="header-actions">
          <button class="refresh-btn">
            <i class="fas fa-sync"></i> Refresh
          </button>
        </div>
      </div>
      
      <component :is="currentComponent" :data="componentData"></component>
    </div>
  </div>
</template>

<script>
import Sidebar from '@/components/dashboard/Sidebar.vue';
import UsersPanel from '@/components/dashboard/UsersPanel.vue';
import SensorsPanel from '@/components/dashboard/SensorsPanel.vue';
import CommunitiesPanel from '@/components/dashboard/CommunitiesPanel.vue';
import OverviewPanel from '@/components/dashboard/OverviewPanel.vue';
import { useUserStore } from '@/stores/userStore';

export default {
  name: 'DashboardView',
  components: {
    Sidebar,
    UsersPanel,
    SensorsPanel,
    CommunitiesPanel,
    OverviewPanel
  },
  data() {
    return {
      user: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        role: 'Administrator',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
      },
      activeMenu: 'overview',
      componentData: {}
    }
  },
  computed: {
    currentComponent() {
      switch(this.activeMenu) {
        case 'users': return 'UsersPanel';
        case 'sensors': return 'SensorsPanel';
        case 'communities': return 'CommunitiesPanel';
        case 'overview':
        default: return 'OverviewPanel';
      }
    },
    pageTitle() {
      switch(this.activeMenu) {
        case 'users': return 'Users Management';
        case 'sensors': return 'Sensors Management';
        case 'communities': return 'Communities Management';
        case 'overview':
        default: return 'Dashboard Overview';
      }
    }
  },
  methods: {
    handleMenuChange(menuItem) {
      this.activeMenu = menuItem;
      // Here you would fetch the relevant data for the selected menu item
      this.loadComponentData();
    },
    handleLogout() {
      // Handle logout logic here
      useUserStore.logout();
      this.$router.push('/login');
    },
    loadComponentData() {
      // Simulate fetching data based on active menu
      // In a real application, this would be an API call
      switch(this.activeMenu) {
        case 'users':
          this.componentData = {
            users: [
              { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', status: 'Active' },
              { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'User', status: 'Active' },
              { id: 3, name: 'Carol Davis', email: 'carol@example.com', role: 'User', status: 'Inactive' }
            ]
          };
          break;
        case 'sensors':
          this.componentData = {
            sensors: [
              { id: 'SEN-001', location: 'Downtown', type: 'Temperature', status: 'Online' },
              { id: 'SEN-002', location: 'Suburb', type: 'Humidity', status: 'Online' },
              { id: 'SEN-003', location: 'Park', type: 'Air Quality', status: 'Offline' }
            ]
          };
          break;
        case 'communities':
          this.componentData = {
            communities: [
              { id: 1, name: 'Weather Enthusiasts', members: 125, region: 'Global' },
              { id: 2, name: 'City Climate Watch', members: 43, region: 'Urban' },
              { id: 3, name: 'Rural Weather Network', members: 67, region: 'Rural' }
            ]
          };
          break;
        case 'overview':
        default:
          this.componentData = {
            stats: {
              users: 243,
              sensors: 58,
              communities: 12,
              activeSensors: 51
            },
            recentActivity: [
              { type: 'user', message: 'New user registered', time: '5 minutes ago' },
              { type: 'sensor', message: 'Sensor SEN-003 went offline', time: '1 hour ago' },
              { type: 'community', message: 'New community created: Weather Watchers', time: '1 day ago' }
            ]
          };
          break;
      }
    }
  },
  created() {
    this.loadComponentData();
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.page-layout {
  display: flex;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #f5f7fa;
}

.sidebar-wrapper {
  width: 250px;
  background-color: #fff;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.05);
  padding: 20px 0;
  overflow-y: auto;
}

.content-wrapper {
  flex: 1;
  padding: 25px 30px;
  overflow-y: auto;
  background-color: #f5f7fa;
  position: relative;
}

/* Título */
h2 {
  font-size: 24px;
  color: #2c3e50;
  font-weight: 600;
  margin-bottom: 25px;
  text-align: center;
}

/* Container de definições */
.settings-container {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  padding: 30px 40px;
  border-radius: 12px;
  background-color: #fff;
  color: #222;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.12);
}

/* Formulários */
.form-group {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
}

label {
  font-weight: 600;
  margin-bottom: 6px;
  color: #333;
}

input[type='text'],
input[type='number'],
select {
  background-color: #f5f7fa;
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 8px 12px;
  color: #333;
  font-size: 14px;
  transition: border-color 0.3s ease;
}

input[type='text']::placeholder,
input[type='number']::placeholder {
  color: #999;
}

input[type='text']:focus,
input[type='number']:focus,
select:focus {
  outline: none;
  border-color: #41b06e;
  background-color: #e9f5ec;
  color: #222;
}

/* Alert thresholds */
.alert-thresholds {
  border: 1px solid #41b06e;
  border-radius: 6px;
  padding: 15px 20px;
  margin-bottom: 20px;
  color: #333;
}

.alert-thresholds legend {
  font-weight: 700;
  font-size: 16px;
  margin-bottom: 15px;
  color: #41b06e;
}

.alert-row {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  gap: 10px;
}

.alert-row label {
  min-width: 100px;
  color: #4a7f57;
}

.alert-row input[type='number'] {
  width: 80px;
  text-align: center;
}

/* Checkbox */
.checkbox-group label {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  color: #333;
}

.checkbox-group input[type='checkbox'] {
  transform: scale(1.3);
  cursor: pointer;
}

/* Botão de guardar */
.save-btn {
  width: 100%;
  background-color: #41b06e;
  border: none;
  border-radius: 8px;
  padding: 12px 0;
  font-weight: 700;
  font-size: 16px;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.save-btn:hover {
  background-color: #2d7d4b;
}

/* Responsivo */
@media screen and (max-width: 768px) {
  .page-layout {
    flex-direction: column;
  }

  .sidebar-wrapper {
    width: 100%;
    height: auto;
    position: relative;
  }

  .content-wrapper {
    width: 100%;
    padding: 15px;
  }

  .settings-container {
    padding: 20px;
  }
}
</style>

