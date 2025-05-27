<template>
  <div class="users-panel">
    <div class="panel-actions">
      <div class="search-bar">
        <input type="text" placeholder="Search users..." v-model="searchQuery">
        <i class="fas fa-search"></i>
      </div>
      <button class="add-btn">
        <i class="fas fa-plus"></i> Add New User
      </button>
    </div>
    
    <div class="users-table">
      <table>
        <thead>
          <tr>
            <th>#ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in filteredUsers" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td>
              <span class="role-badge" :class="{ 'admin-role': user.role === 'Admin' }">
                {{ user.role }}
              </span>
            </td>
            <td>
              <span class="status-badge" :class="{ 'status-active': user.status === 'Active', 'status-inactive': user.status === 'Inactive' }">
                {{ user.status }}
              </span>
            </td>
            <td>
              <div class="action-buttons">
                <button class="edit-btn">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="delete-btn">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      
      <div v-if="filteredUsers.length === 0" class="no-results">
        <p>No users found</p>
      </div>
    </div>
    
    <div class="pagination">
      <button class="page-btn" :disabled="currentPage === 1" @click="currentPage--">
        <i class="fas fa-chevron-left"></i>
      </button>
      <span class="page-info">Page {{ currentPage }} of {{ totalPages }}</span>
      <button class="page-btn" :disabled="currentPage === totalPages" @click="currentPage++">
        <i class="fas fa-chevron-right"></i>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UsersPanel',
  props: {
    data: {
      type: Object,
      default: () => ({ users: [] })
    }
  },
  data() {
    return {
      searchQuery: '',
      currentPage: 1,
      itemsPerPage: 10
    }
  },
  computed: {
    filteredUsers() {
      if (!this.data.users) return [];
      
      return this.data.users.filter(user => {
        const searchLower = this.searchQuery.toLowerCase();
        return user.name.toLowerCase().includes(searchLower) ||
               user.email.toLowerCase().includes(searchLower) ||
               user.role.toLowerCase().includes(searchLower);
      });
    },
    totalPages() {
      return Math.max(1, Math.ceil(this.filteredUsers.length / this.itemsPerPage));
    },
    paginatedUsers() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredUsers.slice(start, end);
    }
  }
}
</script>

<style scoped>
.users-panel {
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

.users-table {
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

.role-badge, .status-badge {
  display: inline-block;
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 12px;
  font-weight: 600;
}

.role-badge {
  background-color: #e0e6ed;
  color: #7f8c8d;
}

.admin-role {
  background-color: #3498db;
  color: white;
}

.status-badge {
  background-color: #e0e6ed;
  color: #7f8c8d;
}

.status-active {
  background-color: #41B06E;
  color: white;
}

.status-inactive {
  background-color: #e74c3c;
  color: white;
}

.action-buttons {
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

.no-results {
  padding: 20px;
  text-align: center;
  color: #7f8c8d;
  font-style: italic;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
}

.page-btn {
  width: 35px;
  height: 35px;
  border-radius: 4px;
  background-color: #fff;
  border: 1px solid #e0e6ed;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  font-size: 14px;
  color: #7f8c8d;
}
</style>
