<template>
  <div class="overview-panel">
    <!-- Stats Cards -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon users-icon">
          <i class="fas fa-users"></i>
        </div>
        <div class="stat-info">
          <h3>Users</h3>
          <p class="stat-value">{{ data.stats?.users || 0 }}</p>
          <p class="stat-desc">Total registered users</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon sensors-icon">
          <i class="fas fa-microchip"></i>
        </div>
        <div class="stat-info">
          <h3>Sensors</h3>
          <p class="stat-value">{{ data.stats?.sensors || 0 }}</p>
          <p class="stat-desc">Total deployed sensors</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon communities-icon">
          <i class="fas fa-city"></i>
        </div>
        <div class="stat-info">
          <h3>Communities</h3>
          <p class="stat-value">{{ data.stats?.communities || 0 }}</p>
          <p class="stat-desc">Active communities</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon active-icon">
          <i class="fas fa-signal"></i>
        </div>
        <div class="stat-info">
          <h3>Active Sensors</h3>
          <p class="stat-value">{{ data.stats?.activeSensors || 0 }}</p>
          <p class="stat-desc">Currently online</p>
        </div>
      </div>
    </div>
    
    <!-- Recent Activity -->
    <div class="activity-section">
      <h2>Recent Activity</h2>
      <div class="activity-list">
        <div v-for="(activity, index) in data.recentActivity" :key="index" class="activity-item">
          <div class="activity-icon" :class="getActivityIconClass(activity.type)">
            <i :class="getActivityIcon(activity.type)"></i>
          </div>
          <div class="activity-content">
            <p class="activity-message">{{ activity.message }}</p>
            <p class="activity-time">{{ activity.time }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts would go here in a real implementation -->
    <div class="charts-section">
      <h2>Weather Sensor Data</h2>
      <div class="chart-placeholder">
        <p>Weather data visualization charts would be displayed here.</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OverviewPanel',
  props: {
    data: {
      type: Object,
      default: () => ({
        stats: {
          users: 0,
          sensors: 0,
          communities: 0,
          activeSensors: 0
        },
        recentActivity: []
      })
    }
  },
  methods: {
    getActivityIcon(type) {
      switch(type) {
        case 'user': return 'fas fa-user';
        case 'sensor': return 'fas fa-microchip';
        case 'community': return 'fas fa-city';
        default: return 'fas fa-info-circle';
      }
    },
    getActivityIconClass(type) {
      switch(type) {
        case 'user': return 'user-activity';
        case 'sensor': return 'sensor-activity';
        case 'community': return 'community-activity';
        default: return '';
      }
    }
  }
}
</script>

<style scoped>
.overview-panel {
  display: flex;
  flex-direction: column;
  gap: 25px;
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
  width: 100%;
}

.stat-card {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.users-icon {
  background-color: rgba(65, 176, 110, 0.2);
  color: #41B06E;
}

.sensors-icon {
  background-color: rgba(52, 152, 219, 0.2);
  color: #3498db;
}

.communities-icon {
  background-color: rgba(155, 89, 182, 0.2);
  color: #9b59b6;
}

.active-icon {
  background-color: rgba(241, 196, 15, 0.2);
  color: #f1c40f;
}

.stat-info {
  flex: 1;
}

.stat-info h3 {
  font-size: 14px;
  color: #7f8c8d;
  margin: 0;
  margin-bottom: 5px;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
}

.stat-desc {
  font-size: 12px;
  color: #95a5a6;
  margin: 5px 0 0;
}

.activity-section, .charts-section {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  width: 100%;
}

.activity-section h2, .charts-section h2 {
  font-size: 18px;
  color: #2c3e50;
  margin: 0 0 15px 0;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 10px;
  border-radius: 6px;
  background-color: #f8f9fa;
}

.activity-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

.user-activity {
  background-color: rgba(65, 176, 110, 0.2);
  color: #41B06E;
}

.sensor-activity {
  background-color: rgba(52, 152, 219, 0.2);
  color: #3498db;
}

.community-activity {
  background-color: rgba(155, 89, 182, 0.2);
  color: #9b59b6;
}

.activity-content {
  flex: 1;
}

.activity-message {
  font-size: 14px;
  color: #2c3e50;
  margin: 0;
}

.activity-time {
  font-size: 12px;
  color: #95a5a6;
  margin: 3px 0 0;
}

.chart-placeholder {
  height: 300px;
  background-color: #f8f9fa;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #7f8c8d;
  font-style: italic;
}

@media screen and (min-width: 1440px) {
  .stats-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
