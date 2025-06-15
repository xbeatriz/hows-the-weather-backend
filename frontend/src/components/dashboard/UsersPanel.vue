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
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in paginatedUsers" :key="user._id">
            <td>{{ user.id }}</td>
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td>
              <span class="role-badge" :class="{ 'admin-role': user.role === 'Admin' }">
                {{ user.role }}
              </span>
            </td>
            <td>
              <div class="action-buttons">
                <button class="edit-btn" @click="editUser(user.id)" title="Edit">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="delete-btn" @click="deleteUser(user.id)" title="Delete">
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
     <!-- Modal Edit User -->
    <div v-if="showEditModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <h3>Edit User</h3>
        <form @submit.prevent="submitEditUser">
          <label>
            Name:
            <input type="text" v-model="editForm.name" required />
          </label>
          <label>
            Email:
            <input type="email" v-model="editForm.email" required />
          </label>
          <label>
            Role:
            <select v-model="editForm.role" required>
              <option>Admin</option>
              <option>Normal</option>
            </select>
          </label>
          <div class="modal-actions">
            <button type="submit" class="save-btn">Save</button>
            <button type="button" class="cancel-btn" @click="closeModal">Cancel</button>
          </div>
        </form>
      </div>
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
      itemsPerPage: 10,
      showEditModal: false,
      editForm: {
        id: '',
        name: '',
        email: '',
        role: 'Normal'
      }
    }
  },
  computed: {
    filteredUsers() {
      const users = Array.isArray(this.data.users) ? this.data.users : [];
      const searchLower = this.searchQuery.toLowerCase();

      return users.filter(user => {
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
  },
  methods: {
    editUser(userId) {
      // Encontrar usuário pelo id
      const user = this.data.users.find(u => u.id === userId || u._id === userId);
      if (!user) {
        alert('Usuário não encontrado!');
        return;
      }
      // Preencher formulário do modal
      this.editForm = {
        id: user.id || user._id,
        name: user.name,
        email: user.email,
        role: user.role
      };
      this.showEditModal = true;
    },
    closeModal() {
      this.showEditModal = false;
    },
    async submitEditUser() {
      const userId = this.editForm.id;
      const updatedData = {
        name: this.editForm.name,
        email: this.editForm.email,
        role: this.editForm.role
      };
      await this.updateUser(userId, updatedData);
      // Atualiza dados localmente (ideal seria recarregar a lista do backend)
      const index = this.data.users.findIndex(u => u.id === userId || u._id === userId);
      if (index !== -1) {
        this.data.users[index] = { ...this.data.users[index], ...updatedData };
      }
      this.closeModal();
    },
    async updateUser(userId, userData) {
      try {
        const response = await fetch(`http://localhost:3000/api/user/${userId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userStore.accessToken}`
          },
          body: JSON.stringify(userData)
        });

        if (response.ok) {
          alert('Usuário atualizado com sucesso!');
        } else {
          const errorData = await response.json();
          alert('Falha ao atualizar usuário: ' + (errorData.message || 'Erro desconhecido'));
        }
      } catch (error) {
        alert('Erro ao atualizar usuário: ' + error.message);
      }
    },
    async deleteUser(userId) {
      if (!confirm('Tem certeza que deseja apagar este usuário?')) return;

      try {
        const response = await fetch(`http://localhost:3000/api/user/${userId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userStore.accessToken}`
          }
        });

        if (response.ok) {
          alert('Usuário apagado com sucesso!');
          this.data.users = this.data.users.filter(u => u.id !== userId && u._id !== userId);
        } else {
          const errorData = await response.json();
          alert('Falha ao apagar usuário: ' + (errorData.message || 'Erro desconhecido'));
        }
      } catch (error) {
        alert('Erro ao apagar usuário: ' + error.message);
      }
    }
  }
}
</script>

<style scoped>
.users-panel {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  /* Make sure panel uses full width */
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

.role-badge,
.status-badge {
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

.edit-btn,
.delete-btn {
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
/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 8px;
  padding: 20px 30px;
  width: 320px;
  box-shadow: 0 2px 15px rgba(0,0,0,0.2);
}

.modal-content h3 {
  margin-bottom: 15px;
  font-weight: 600;
  color: #2c3e50;
}

.modal-content label {
  display: block;
  margin-bottom: 10px;
  font-size: 14px;
  color: #34495e;
}

.modal-content input,
.modal-content select {
  width: 100%;
  padding: 8px 10px;
  margin-top: 5px;
  border: 1px solid #e0e6ed;
  border-radius: 6px;
  font-size: 14px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.save-btn {
  background-color: #41B06E;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

.save-btn:hover {
  background-color: #309659;
}

.cancel-btn {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

.cancel-btn:hover {
  background-color: #c0392b;
}
</style>
