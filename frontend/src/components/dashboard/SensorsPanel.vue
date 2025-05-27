<template>
  <div class="sensors-panel">
    <div class="panel-actions">
      <div class="search-bar">
        <input type="text" placeholder="Search sensors..." v-model="searchQuery">
        <i class="fas fa-search"></i>
      </div>
      <button class="add-btn">
        <i class="fas fa-plus"></i> Add New Sensor
      </button>
    </div>
    
    <div class="sensors-table">
      <table>
        <thead>
          <tr>
            <th>Sensor ID</th>
            <th>Location</th>
            <th>Type</th>
            <th>Status</th>
            <th>Last Updated</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="sensor in filteredSensors" :key="sensor.id">
            <td>{{ sensor.id }}</td>
            <td>{{ sensor.location }}</td>
            <td>{{ sensor.type }}</td>
            <td>
              <span class="status-badge" :class="{ 'status-online': sensor.status === 'Online', 'status-offline': sensor.status === 'Offline' }">
                {{ sensor.status }}
              </span>
            </td>
            <td>{{ sensor.lastUpdated || 'N/A' }}</td>
            <td>
              <div class="action-buttons">
                <button class="view-btn" title="View Data">
                  <i class="fas fa-chart-line"></i>
                </button>
                <button class="edit-btn" title="Edit">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="delete-btn" title="Delete">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      
      <div v-if="filteredSensors.length === 0" class="no-results">
        <p>No sensors found</p>
      </div>
    </div>
    
    <div class="sensor-map">
      <h3>Sensor Locations</h3>
      <div class="map-placeholder">
        <p>Map with sensor locations would be displayed here</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SensorsPanel',
  props: {
    data: {
      type: Object,
      default: () => ({ sensors: [] })
    }
  },
  data() {
    return {
      searchQuery: ''
    }
  },
  computed: {
    filteredSensors() {
      if (!this.data.sensors) return [];
      
      return this.data.sensors.filter(sensor => {
        const searchLower = this.searchQuery.toLowerCase();
        return sensor.id.toLowerCase().includes(searchLower) ||
               sensor.location.toLowerCase().includes(searchLower) ||
               sensor.type.toLowerCase().includes(searchLower);
      });
    }
  }
}
</script>

<style scoped>
.sensors-panel {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%; /* Make sure panel uses full width */
}

.panel-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.search-bar {
  position: relative;
  width: 300px;
}

.search-bar input {
  width: 100%;
  padding: 10px 15px 10px 35px;
  border: 1px solid #e0e6ed;
  border-radius: 6px;
  font-size: 14px;
}

.search-bar i {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #95a5a6;
}

.add-btn {
  background-color: #41B06E;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: background-color 0.2s;
}

.add-btn:hover {
  background-color: #309659;
}

.sensors-table {
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

thead th {
  background-color: #f8f9fa;
  color: #2c3e50;
  font-weight: 600;
  font-size: 14px;
  padding: 15px;
}

tbody td {
  padding: 15px;
  border-top: 1px solid #e0e6ed;
  color: #2c3e50;
  font-size: 14px;
}

.status-badge {
  display: inline-block;
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 12px;
  font-weight: 600;
}

.status-online {
  background-color: #41B06E;
  color: white;
}

.status-offline {
  background-color: #e74c3c;
  color: white;
}

.action-buttons {
  display: flex;
  gap: 5px;
}

.view-btn, .edit-btn, .delete-btn {
  width: 30px;
  height: 30px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.view-btn {
  background-color: #f8f9fa;
  color: #f1c40f;
}

.view-btn:hover {
  background-color: #f1c40f;
  color: white;
}

.edit-btn {
  background-color: #f8f9fa;
  color: #3498db;
}

.edit-btn:hover {
  background-color: #3498db;
  color: white;
}

.delete-btn {
  background-color: #f8f9fa;
  color: #e74c3c;
}

.delete-btn:hover {
  background-color: #e74c3c;
  color: white;
}

.no-results {
  padding: 20px;
  text-align: center;
  color: #7f8c8d;
  font-style: italic;
}

.sensor-map {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.sensor-map h3 {
  font-size: 16px;
  color: #2c3e50;
  margin: 0 0 15px 0;
}

.map-placeholder {
  height: 300px;
  background-color: #f8f9fa;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #7f8c8d;
  font-style: italic;
}
</style>
