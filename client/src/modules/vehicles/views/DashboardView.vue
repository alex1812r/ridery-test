<template>
  <DashboardLayout>
    <v-row>
      <v-col cols="12">
        <h2 class="text-h5 font-weight-bold mb-6">Dashboard</h2>
        <v-alert
          v-if="errorMessage"
          type="error"
          variant="tonal"
          class="mb-4"
          closable
          @click:close="errorMessage = ''"
        >
          {{ errorMessage }}
        </v-alert>
      </v-col>
    </v-row>

    <v-row>
      <!-- Card de Usuarios -->
      <v-col cols="12" sm="6" md="4">
        <v-card class="elevation-2" :color="'primary'" variant="tonal">
          <v-card-text>
            <div class="d-flex align-center justify-space-between">
              <div>
                <div class="text-grey-darken-1 text-body-2 mb-1">Usuarios</div>
                <div class="text-h4 font-weight-bold">
                  {{ loading ? '...' : stats.users }}
                </div>
              </div>
              <v-icon size="48" color="primary">mdi-account-group</v-icon>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Card de Vehículos Registrados -->
      <v-col cols="12" sm="6" md="4">
        <v-card class="elevation-2" :color="'success'" variant="tonal">
          <v-card-text>
            <div class="d-flex align-center justify-space-between">
              <div>
                <div class="text-grey-darken-1 text-body-2 mb-1">Vehículos Registrados</div>
                <div class="text-h4 font-weight-bold">
                  {{ loading ? '...' : stats.totalVehicles }}
                </div>
              </div>
              <v-icon size="48" color="success">mdi-car-multiple</v-icon>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Card de Vehículos Activos -->
      <v-col cols="12" sm="6" md="4">
        <v-card class="elevation-2" :color="'info'" variant="tonal">
          <v-card-text>
            <div class="d-flex align-center justify-space-between">
              <div>
                <div class="text-grey-darken-1 text-body-2 mb-1">Vehículos Activos</div>
                <div class="text-h4 font-weight-bold">
                  {{ loading ? '...' : stats.activeVehicles }}
                </div>
              </div>
              <v-icon size="48" color="info">mdi-car-sports</v-icon>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </DashboardLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import DashboardLayout from '../../../components/DashboardLayout.vue';
import api from '../../../core/api/axios.js';

const stats = ref({
  users: 0,
  totalVehicles: 0,
  activeVehicles: 0
});
const loading = ref(false);
const errorMessage = ref('');

/**
 * Obtiene los indicadores del dashboard desde la API
 */
const fetchDashboardMetrics = async () => {
  loading.value = true;
  errorMessage.value = '';

  try {
    const response = await api.get('/dashboard/metrics');
    const data = response.data?.data || {};
    stats.value = {
      users: data.totalUsers || 0,
      totalVehicles: data.totalVehicles || 0,
      activeVehicles: data.activeVehicles || 0
    };
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'No fue posible cargar los indicadores';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchDashboardMetrics();
});
</script>

<style scoped>
/* Estilos específicos si son necesarios */
</style>
