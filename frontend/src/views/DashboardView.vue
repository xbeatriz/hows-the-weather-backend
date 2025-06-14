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
          <button class="refresh-btn" @click="loadComponentData">
            <i class="fas fa-sync"></i> Atualizar
          </button>
          <button class="create-btn" @click="openCreateUserForm">+ Novo Utilizador</button>
          <button class="create-btn" @click="openCreateSensorForm">+ Novo Sensor</button>
          <button class="create-btn" @click="openCreateCommunityForm">+ Nova Comunidade</button>
        </div>
      </div>

      <!-- Painel dinâmico -->
      <component :is="currentComponent" :data="componentData" />

      <!-- Modais -->
      <Modal v-if="showCreateUser" title="Criar Novo Utilizador" @close="showCreateUser = false">
        <CreateUserForm @submitted="onFormSubmitted" @cancel="showCreateUser = false" />
      </Modal>

      <Modal v-if="showCreateSensor" title="Criar Novo Sensor" @close="showCreateSensor = false">
        <CreateSensorForm @submitted="onFormSubmitted" @cancel="showCreateSensor = false" />
      </Modal>

      <Modal v-if="showCreateCommunity" title="Criar Nova Comunidade" @close="showCreateCommunity = false">
        <CreateCommunityForm @submitted="onFormSubmitted" @cancel="showCreateCommunity = false" />
      </Modal>
    </div>
  </div>
</template>

<script>
import Sidebar from '@/components/dashboard/Sidebar.vue';
import OverviewPanel from '@/components/dashboard/OverviewPanel.vue';
import UsersPanel from '@/components/dashboard/UsersPanel.vue';
import SensorsPanel from '@/components/dashboard/SensorsPanel.vue';
import CommunitiesPanel from '@/components/dashboard/CommunitiesPanel.vue';

import Modal from '@/components/common/Modal.vue';
import CreateUserForm from '@/components/forms/CreateUserForm.vue';
import CreateSensorForm from '@/components/forms/CreateSensorForm.vue';
import CreateCommunityForm from '@/components/forms/CreateCommunityForm.vue';

import { useUserStore } from '@/stores/userStore';

export default {
  name: 'DashboardView',
  components: {
    Sidebar,
    OverviewPanel,
    UsersPanel,
    SensorsPanel,
    CommunitiesPanel,
    Modal,
    CreateUserForm,
    CreateSensorForm,
    CreateCommunityForm
  },
  data() {
    return {
      activeMenu: 'overview',
      componentData: {},

      // Controlo de modais
      showCreateUser: false,
      showCreateSensor: false,
      showCreateCommunity: false
    };
  },
  computed: {
    currentComponent() {
      switch (this.activeMenu) {
        case 'users': return 'UsersPanel';
        case 'sensors': return 'SensorsPanel';
        case 'communities': return 'CommunitiesPanel';
        default: return 'OverviewPanel';
      }
    },
    pageTitle() {
      switch (this.activeMenu) {
        case 'users': return 'Gestão de Utilizadores';
        case 'sensors': return 'Gestão de Sensores';
        case 'communities': return 'Gestão de Comunidades';
        default: return 'Resumo Geral';
      }
    }
  },
  methods: {
    handleMenuChange(menuItem) {
      this.activeMenu = menuItem;
      this.loadComponentData();
    },
    handleLogout() {
      useUserStore().logout();
      this.$router.push('/login');
    },
    loadComponentData() {
      // Aqui colocas as chamadas reais à API
      switch (this.activeMenu) {
        case 'users':
          this.componentData = {
            users: [
              { id: 1, name: 'Alice', email: 'alice@example.com', type: 'admin' },
              { id: 2, name: 'Bob', email: 'bob@example.com', type: 'normal' }
            ]
          };
          break;
        case 'sensors':
          this.componentData = {
            sensors: [
              { id: 'S1', location: 'Lisboa', type: 'Temperatura', status: 'Ativo' }
            ]
          };
          break;
        case 'communities':
          this.componentData = {
            communities: [
              { id: 1, location: 'Lisboa', members_count: 25 }
            ]
          };
          break;
        case 'overview':
        default:
          this.componentData = {
            stats: {
              users: 2,
              sensors: 1,
              communities: 1
            }
          };
          break;
      }
    },
    openCreateUserForm() {
      this.showCreateUser = true;
    },
    openCreateSensorForm() {
      this.showCreateSensor = true;
    },
    openCreateCommunityForm() {
      this.showCreateCommunity = true;
    },
    onFormSubmitted() {
      this.showCreateUser = false;
      this.showCreateSensor = false;
      this.showCreateCommunity = false;
      this.loadComponentData(); // Recarrega após submissão
    }
  },
  mounted() {
    this.loadComponentData();
  }
};
</script>

<style scoped>
.dashboard-container {
  display: flex;
  height: 100vh;
}

.dashboard-content {
  flex: 1;
  padding: 20px;
  background: #f5f7fa;
  overflow-y: auto;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.refresh-btn,
.create-btn {
  background-color: #41b06e;
  border: none;
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.refresh-btn:hover,
.create-btn:hover {
  background-color: #2e8753;
}
</style>
