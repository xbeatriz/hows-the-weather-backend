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
          <button class="create-btn" @click="openCreateUserForm">
            + Novo Utilizador
          </button>
          <button class="create-btn" @click="openCreateSensorForm">
            + Novo Sensor
          </button>
          <button class="create-btn" @click="openCreateCommunityForm">
            + Nova Comunidade
          </button>
        </div>
      </div>

      <!-- Painel dinâmico -->
      <component :is="currentComponent" :data="componentData" />

      <!-- Modais -->
      <Modal
        v-if="showCreateUser"
        title="Criar Novo Utilizador"
        @close="showCreateUser = false"
      >
        <CreateUserForm
          @submitted="onFormSubmitted"
          @cancel="showCreateUser = false"
        />
      </Modal>

      <Modal
        v-if="showCreateSensor"
        title="Criar Novo Sensor"
        @close="showCreateSensor = false"
      >
        <CreateSensorForm
          @submitted="onFormSubmitted"
          @cancel="showCreateSensor = false"
        />
      </Modal>

      <Modal
        v-if="showCreateCommunity"
        title="Criar Nova Comunidade"
        @close="showCreateCommunity = false"
      >
        <CreateCommunityForm
          @submitted="onFormSubmitted"
          @cancel="showCreateCommunity = false"
        />
      </Modal>
    </div>
  </div>
</template>

<script>
import Sidebar from "@/components/dashboard/Sidebar.vue";
import OverviewPanel from "@/components/dashboard/OverviewPanel.vue";
import UsersPanel from "@/components/dashboard/UsersPanel.vue";
import SensorsPanel from "@/components/dashboard/SensorsPanel.vue";
import CommunitiesPanel from "@/components/dashboard/ComunitiesPanel.vue";
import PendingPostsPanel from "@/components/dashboard/PendingPostPanel.vue";
import CreateUserForm from "@/components/forms/CreateUserForm.vue";
import CreateSensorForm from "@/components/forms/CreateSensorForm.vue";
import CreateCommunityForm from "@/components/forms/CreateCommunityForm.vue";
import Modal from "@/components/common/Modal.vue";
import { useUserStore } from "@/stores/userStore";

export default {
  name: "DashboardView",
  components: {
    Sidebar,
    Modal,
    OverviewPanel,
    UsersPanel,
    SensorsPanel,
    CommunitiesPanel,
    PendingPostsPanel,
    CreateUserForm,
    CreateSensorForm,
    CreateCommunityForm,
  },
  data() {
    return {
      activeMenu: "overview",
      componentData: {},

      // Modais
      showCreateUser: false,
      showCreateSensor: false,
      showCreateCommunity: false,

      userStore: useUserStore(), // <-- adicionar aqui
    };
  },
  computed: {
    currentComponent() {
      if (
        this.activeMenu === "pendingPosts" &&
        this.userStore.user.role !== "admin"
      ) {
        return "OverviewPanel"; // ou podes redirecionar, se preferires
      }

      switch (this.activeMenu) {
        case "users":
          return "UsersPanel";
        case "sensors":
          return "SensorsPanel";
        case "communities":
          return "CommunitiesPanel";
        case "pendingPosts":
          return "PendingPostsPanel";
        default:
          return "OverviewPanel";
      }
    },
    pageTitle() {
      switch (this.activeMenu) {
        case "users":
          return "Gestão de Utilizadores";
        case "sensors":
          return "Gestão de Sensores";
        case "communities":
          return "Gestão de Comunidades";
        case "pendingPosts":
          return "Aprovação de Posts";
        default:
          return "Resumo Geral";
      }
    },
  },
  methods: {
    handleMenuChange(menuItem) {
      this.activeMenu = menuItem;
      this.loadComponentData();
    },
    handleLogout() {
      useUserStore().logout();
      this.$router.push("/login");
    },
    loadComponentData() {
      const token =
        this.userStore.accessToken || localStorage.getItem("accessToken");
      const refreshToken =
        this.userStore.refreshToken || localStorage.getItem("refreshToken");
      const headers = {
        Authorization: `Bearer ${token}`,
        "x-refresh-token": refreshToken,
      };

      switch (this.activeMenu) {
        case "users":
          fetch("http://localhost:3000/api/user", { headers })
            .then((res) => {
              if (!res.ok) throw new Error("Erro ao carregar usuários");
              return res.json();
            })
            .then((data) => {
              this.componentData = { users: data.data.users || [] };
            })
            .catch(() => {
              this.componentData = { users: [] };
            });
          break;

        case "sensors":
          fetch("http://localhost:3000/api/sensors", { headers })
            .then((res) => {
              if (!res.ok) throw new Error("Erro ao carregar sensores");
              return res.json();
            })
            .then((data) => {
              this.componentData = { sensors: data.data.sensors || [] };
            })
            .catch(() => {
              this.componentData = { sensors: [] };
            });
          break;

        case "communities":
          fetch("http://localhost:3000/api/communities", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
            .then((res) => {
              if (!res.ok) throw new Error("Erro ao carregar comunidades");
              return res.json();
            })
            .then((data) => {
              this.communities = data.data.communities || [];
            })
            .catch(() => {
              this.componentData = { communities: [] };
            });
          break;

        case "pendingPosts":
          if (this.userStore.user.role !== "admin") {
            this.componentData = {};
            break;
          }
          fetch("http://localhost:3000/api/communities", { headers })
            .then((res) => {
              if (!res.ok) throw new Error("Erro ao carregar posts pendentes");
              return res.json();
            })
            .then((data) => {
              const pendingPosts = [];
              for (const community of data.communities || []) {
                for (const post of community.community_posts || []) {
                  if (post.status === "waiting") {
                    pendingPosts.push({ ...post, community_id: community._id });
                  }
                }
              }
              this.componentData = { pendingPosts };
            })
            .catch(() => {
              this.componentData = { pendingPosts: [] };
            });
          break;

        case "overview":
        default:
          Promise.all([
            fetch("http://localhost:3000/api/user", { headers }).then((res) => {
              if (!res.ok) throw new Error("Erro no fetch users");
              return res.json();
            }),
            fetch("http://localhost:3000/api/sensors", { headers }).then(
              (res) => {
                if (!res.ok) throw new Error("Erro no fetch sensors");
                return res.json();
              }
            ),
            fetch("http://localhost:3000/api/communities", { headers }).then(
              (res) => {
                if (!res.ok) throw new Error("Erro no fetch communities");
                return res.json();
              }
            ),
          ])
            .then(([usersData, sensorsData, communitiesData]) => {
              // Contar sensores ativos
              const activeSensorsCount = (
                sensorsData.data.sensors || []
              ).filter((sensor) => sensor.status === "active").length;

              this.componentData = {
                stats: {
                  users: usersData.data.users?.length || 0,
                  sensors: sensorsData.data.sensors?.length || 0,
                  activeSensors: activeSensorsCount,
                  communities: communitiesData.data.communities?.length || 0,
                },
              };
            })
            .catch((error) => {
              console.error(error);
              this.componentData = {
                stats: {
                  users: 0,
                  sensors: 0,
                  activeSensors: 0,
                  communities: 0,
                },
              };
            });
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
    },
  },
  mounted() {
    this.loadComponentData();
  },
};
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
  padding: 20px;
  background: #f5f7fa;
  overflow-y: auto;
  color: #222;
  /* cor de texto escura para legibilidade */
  font-family: Arial, sans-serif;
  font-size: 16px;
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
