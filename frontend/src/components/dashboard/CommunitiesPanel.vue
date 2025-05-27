<template>
  <div class="communities-panel">
    <div class="panel-actions">
      <div class="search-bar">
        <input type="text" placeholder="Search communities..." v-model="searchQuery">
        <i class="fas fa-search"></i>
      </div>
      <button class="add-btn">
        <i class="fas fa-plus"></i> Create New Community
      </button>
    </div>
    
    <div class="communities-grid">
      <div v-for="community in filteredCommunities" :key="community.id" class="community-card">
        <div class="community-header">
          <h3>{{ community.name }}</h3>
          <div class="community-actions">
            <button class="edit-btn" title="Edit">
              <i class="fas fa-edit"></i>
            </button>
            <button class="delete-btn" title="Delete">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
        <div class="community-stats">
          <div class="stat">
            <i class="fas fa-users"></i>
            <span>{{ community.members }} Members</span>
          </div>
          <div class="stat">
            <i class="fas fa-map-marker-alt"></i>
            <span>{{ community.region }}</span>
          </div>
        </div>
        <div class="community-description">
          <p>{{ community.description || 'No description available for this community.' }}</p>
        </div>
        <button class="view-details-btn">View Details</button>
      </div>
      
      <div v-if="filteredCommunities.length === 0" class="no-results">
        <p>No communities found</p>
      </div>
    </div>
    
    <div class="communities-stats-section">
      <h3>Communities Overview</h3>
      <div class="stats-cards">
        <div class="stat-card">
          <h4>Total Communities</h4>
          <p>{{ data.communities?.length || 0 }}</p>
        </div>
        <div class="stat-card">
          <h4>Total Members</h4>
          <p>{{ totalMembers }}</p>
        </div>
        <div class="stat-card">
          <h4>Most Active Region</h4>
          <p>{{ mostActiveRegion || 'N/A' }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CommunitiesPanel',
  props: {
    data: {
      type: Object,
      default: () => ({ communities: [] })
    }
  },
  data() {
    return {
      searchQuery: ''
    }
  },
  computed: {
    filteredCommunities() {
      if (!this.data.communities) return [];
      
      return this.data.communities.filter(community => {
        const searchLower = this.searchQuery.toLowerCase();
        return community.name.toLowerCase().includes(searchLower) ||
               community.region.toLowerCase().includes(searchLower);
      });
    },
    totalMembers() {
      if (!this.data.communities) return 0;
      return this.data.communities.reduce((sum, community) => sum + community.members, 0);
    },
    mostActiveRegion() {
      if (!this.data.communities || this.data.communities.length === 0) return null;
      
      const regionCounts = {};
      this.data.communities.forEach(community => {
        if (!regionCounts[community.region]) {
          regionCounts[community.region] = 0;
        }
        regionCounts[community.region] += community.members;
      });
      
      let maxRegion = null;
      let maxCount = 0;
      
      for (const region in regionCounts) {
        if (regionCounts[region] > maxCount) {
          maxCount = regionCounts[region];
          maxRegion = region;
        }
      }
      
      return maxRegion;
    }
  }
}
</script>

<style scoped>
.communities-panel {
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

.communities-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.community-card {
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  transition: all 0.3s;
}

.community-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.community-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.community-header h3 {
  font-size: 18px;
  color: #2c3e50;
  margin: 0;
}

.community-actions {
  display: flex;
  gap: 5px;
}

.edit-btn, .delete-btn {
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

.community-stats {
  display: flex;
  gap: 15px;
}

.stat {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #7f8c8d;
  font-size: 14px;
}

.stat i {
  color: #9b59b6;
}

.community-description {
  color: #2c3e50;
  font-size: 14px;
  line-height: 1.5;
}

.view-details-btn {
  margin-top: auto;
  padding: 8px 0;
  background-color: transparent;
  border: 1px solid #41B06E;
  color: #41B06E;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s;
}

.view-details-btn:hover {
  background-color: #41B06E;
  color: white;
}

.no-results {
  grid-column: 1 / -1;
  padding: 20px;
  text-align: center;
  color: #7f8c8d;
  font-style: italic;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.communities-stats-section {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.communities-stats-section h3 {
  font-size: 18px;
  color: #2c3e50;
  margin: 0 0 15px 0;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
}

.stats-cards .stat-card {
  background-color: #f8f9fa;
  border-radius: 6px;
  padding: 15px;
  text-align: center;
}

.stats-cards .stat-card h4 {
  font-size: 14px;
  color: #7f8c8d;
  margin: 0 0 5px 0;
  font-weight: normal;
}

.stats-cards .stat-card p {
  font-size: 20px;
  color: #2c3e50;
  font-weight: 600;
  margin: 0;
}
</style>
