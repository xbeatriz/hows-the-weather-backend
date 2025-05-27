<template>
  <div class="dashboard-container">
    <Sidebar 
      :user="user" 
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
      console.log('User logged out');
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

.dashboard-container {
  display: flex;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #f5f7fa;
}

.dashboard-content {
  flex: 1;
  padding: 25px 30px;
  overflow-y: auto;
  background-color: #f5f7fa;
  position: relative;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e0e6ed;
  width: 100%;
}

.content-header h1 {
  font-size: 24px;
  color: #2c3e50;
  font-weight: 600;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.refresh-btn {
  background-color: #ffffff;
  color: #41B06E;
  border: 1px solid #e0e6ed;
  padding: 8px 15px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: all 0.2s;
}

.refresh-btn:hover {
  background-color: #f8f9fa;
  border-color: #41B06E;
}

/* Media queries for responsiveness */
@media screen and (max-width: 768px) {
  .dashboard-container {
    flex-direction: column;
  }
  
  .dashboard-content {
    width: 100%;
    padding: 15px;
  }
  
  .content-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .header-actions {
    width: 100%;
  }
}
</style>
