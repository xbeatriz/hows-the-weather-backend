<template>
  <div class="page-layout">
      <Sidebar
        :activeMenu="activeMenu"
        :menuItems="menuItems"
        :user="userStore.user"
        headerText="Weather Admin"
        @menuChange="handleMenuChange"
        @logout="handleLogout"
      />

    <div class="content-wrapper">
      <div class="settings-container">
        <h2>Definições</h2>

        <!-- Dados Pessoais -->
        <section class="personal-data">
          <h3>Dados Pessoais</h3>

          <div class="form-group">
            <label for="name">Nome</label>
            <input
              id="name"
              type="text"
              v-model="userData.name"
              placeholder="Novo nome"
            />
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input
              id="email"
              type="text"
              v-model="userData.email"
              placeholder="Novo email"
            />
          </div>

          <div class="form-group">
            <label for="password">Nova Password</label>
            <input
              id="password"
              type="password"
              v-model="userData.password"
              placeholder="Nova password"
            />
            <small class="hint">Deixe em branco para manter a senha atual</small>
          </div>

          <div class="form-group">
            <button
              type="button"
              class="save-btn"
              @click="updateUserData"
              :disabled="!canUpdateUserData"
              title="Clique para atualizar os seus dados pessoais"
            >
              Atualizar Dados Pessoais
            </button>
          </div>
        </section>

        <!-- Configurações -->
        <form @submit.prevent="updateConfigs" key="user-config-form" class="configs-form">
          <h3>Configurações</h3>

          <div class="form-group">
            <label for="location-select">Localização</label>
            <select id="location-select" v-model="config.location">
              <option :value="config.location" disabled hidden>
                {{ config.location || 'Selecione uma localização' }}
              </option>
              <option v-for="loc in availableLocations" :key="loc" :value="loc">
                {{ loc }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="sensor-select">Sensor</label>
            <select id="sensor-select" v-model="config.sensorid">
              <option :value="null">Nenhum sensor associado</option>
              <option
                v-for="sensor in filteredSensors"
                :key="sensor._id"
                :value="sensor._id"
              >
                {{ sensor.name || sensor._id }}
              </option>
            </select>
          </div>

          <fieldset class="form-group alert-thresholds">
            <legend>Limites de Alertas</legend>

            <div class="alert-row">
              <label>Temperatura</label>
              <input
                type="number"
                v-model.number="config.alert_thresholds.temperature.min"
                placeholder="Min"
              />
              <input
                type="number"
                v-model.number="config.alert_thresholds.temperature.max"
                placeholder="Max"
              />
            </div>

            <div class="alert-row">
              <label>Humidade</label>
              <input
                type="number"
                v-model.number="config.alert_thresholds.humidity.min"
                placeholder="Min"
              />
              <input
                type="number"
                v-model.number="config.alert_thresholds.humidity.max"
                placeholder="Max"
              />
            </div>

            <div class="alert-row">
              <label>Gás</label>
              <input
                type="number"
                v-model.number="config.alert_thresholds.gas.min"
                placeholder="Min"
              />
              <input
                type="number"
                v-model.number="config.alert_thresholds.gas.max"
                placeholder="Max"
              />
            </div>
          </fieldset>

          <div class="form-group">
            <label for="notification-type">Tipo de Notificação</label>
            <select id="notification-type" v-model="config.notification_type">
              <option value="email">Email</option>
              <option value="app">App</option>
            </select>
          </div>

          <div class="form-group">
            <label for="forecast-range">Intervalo de Previsão</label>
            <select id="forecast-range" v-model="config.forecast_range">
              <option value="hour">Hora</option>
              <option value="diary">Diário</option>
              <option value="weekly">Semanal</option>
              <option value="monthly">Mensal</option>
            </select>
          </div>

          <div class="form-group checkbox-group">
            <label>
              <input type="checkbox" v-model="config.global_alert" />
              Alertas Globais
            </label>
          </div>

          <button type="submit" class="save-btn">Guardar Configurações</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { useUserStore } from '@/stores/userStore';
import { useSensorStore } from '@/stores/sensorStore';
import Sidebar from '@/components/dashboard/Sidebar.vue';

export default {
  name: 'Settings',
  components: {
    Sidebar,
  },
  data() {
    return {
      userData: {
        name: '',
        email: '',
        password: '',
      },
      config: {
        location: null,
        sensorid: null,
        alert_thresholds: {
          temperature: { min: null, max: null },
          humidity: { min: null, max: null },
          gas: { min: null, max: null },
        },
        notification_type: 'email',
        forecast_range: 'hour',
        global_alert: false,
      },
      availableLocations: [
        'Lisboa, Portugal',
        'Porto, Portugal',
        'Coimbra, Portugal',
        'Faro, Portugal',
        'Braga, Portugal',
        'Aveiro, Portugal',
        'Viseu, Portugal',
        'Setúbal, Portugal',
      ],
      sensorStore: useSensorStore(),
      userStore: useUserStore(),
      activeMenu: 'overview',
    };
  },
  computed: {
    filteredSensors() {
      const location = this.userStore.user?.location;
      return this.sensorStore.sensors.filter((s) => s.location === location);
    },
  },
  async created() {
    const user = this.userStore.user;
    if (user && user.configs?.length > 0) {
      this.config = { ...user.configs[0] };

      if (this.config.sensorid && typeof this.config.sensorid !== 'string') {
        this.config.sensorid = String(this.config.sensorid);
      }

      const index = this.availableLocations.indexOf(this.config.location);
      if (index > -1) this.availableLocations.splice(index, 1);
      if (this.config.location) this.availableLocations.unshift(this.config.location);
    }

    this.userData.name = user?.name || '';
    this.userData.email = user?.email || '';
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
    async updateUserData() {
      try {
        const payload = {
          name: this.userData.name,
          email: this.userData.email,
        };

        if (this.userData.password) {
          payload.password = this.userData.password;
        }

        const res = await fetch('/api/me', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.userStore.token}`,
          },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error('Erro ao atualizar dados pessoais');

        const updated = await res.json();
        this.userStore.setUserData(updated, this.userStore.token);
        this.userData.password = '';
        alert('Dados atualizados com sucesso!');
      } catch (err) {
        console.error(err);
        alert('Erro ao atualizar dados pessoais.');
      }
    },

    async updateConfigs() {
      try {
        const payload = {
          configs: [
            {
              ...this.config,
              sensorid: this.config.sensorid?.trim() || null,
            },
          ],
        };

        const res = await fetch('/api/me/configs', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.userStore.token}`,
          },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error('Erro ao atualizar configurações');

        const updatedConfigs = await res.json();
        this.userStore.setUserData(
          { ...this.userStore.user, configs: updatedConfigs },
          this.userStore.token
        );
        alert('Configurações atualizadas!');
      } catch (err) {
        console.error(err);
        alert('Erro ao atualizar configurações.');
      }
    },
  },
};
</script>

<style scoped>
/* Reset e box sizing */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.page-layout {
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background: #f5f7fa;
}

.sidebar-wrapper, /* só se usares wrapper, senão podes aplicar direto no Sidebar */
Sidebar {
  flex: 0 0 250px; /* largura fixa para sidebar */
  background-color: #fff;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.05);
  overflow-y: auto;
  height: 100vh;
}

.content-wrapper {
  flex: 1;
  height: 100vh;
  overflow-y: auto;
  padding: 40px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

/* Caixa de definições central */
.settings-container {
  width: 100%;
  max-width: 900px;
  margin: 40px auto;
  padding: 30px 40px;
  border-radius: 12px;
  background-color: #fff;
  color: #222;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.12);
  min-height: calc(100vh - 80px); /* Ocupa quase toda a altura */
}

/* Título principal */
h2 {
  margin-bottom: 30px;
  color: #41b06e;
  font-weight: 700;
  font-size: 28px;
  text-align: center;
}

/* Grupos de formulário */
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

/* Secção de limites de alerta */
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

/* Checkboxes personalizados */
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
</style>

