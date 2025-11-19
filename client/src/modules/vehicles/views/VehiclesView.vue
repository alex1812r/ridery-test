<template>
  <DashboardLayout>
    <v-row>
      <v-col cols="12">
        <div class="d-flex align-center justify-space-between mb-4">
          <h2 class="text-h5 font-weight-bold">Vehículos</h2>
          <v-btn
            color="primary"
            prepend-icon="mdi-plus"
            @click="openCreateDialog"
          >
            Nuevo Vehículo
          </v-btn>
        </div>

        <v-data-table-server
          :headers="headers"
          :items="vehicleStore.vehicles"
          :loading="vehicleStore.loading"
          :items-per-page="itemsPerPage"
          :page="currentPage"
          :items-length="vehicleStore.total"
          :items-per-page-options="itemsPerPageOptions"
          @update:page="handlePageChange"
          @update:items-per-page="handleItemsPerPageChange"
          class="elevation-2"
        >
          <template v-slot:item.status="{ item }">
            <v-chip
              :color="getStatusColor(item.status)"
              size="small"
              variant="flat"
            >
              {{ getStatusLabel(item.status) }}
            </v-chip>
          </template>

          <template v-slot:item.actions="{ item }">
            <v-btn
              icon
              variant="text"
              size="small"
              @click="openStatusDialog(item)"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </template>

          <template v-slot:no-data>
            <div class="text-center py-8">
              <v-icon size="64" color="grey-lighten-1">mdi-car-off</v-icon>
              <p class="text-body-1 mt-4 text-grey">No hay vehículos registrados</p>
            </div>
          </template>
        </v-data-table-server>
      </v-col>
    </v-row>

    <!-- Dialog para crear/editar vehículo -->
    <VehicleDialog
      v-model="showVehicleDialog"
      :vehicle="selectedVehicle"
      :loading="vehicleStore.loading"
      :error="vehicleStore.error"
      @submit="handleVehicleSubmit"
      @close="closeVehicleDialog"
    />

    <!-- Dialog para cambiar estado -->
    <StatusDialog
      v-model="showStatusDialog"
      :vehicle="selectedVehicle"
      :loading="statusLoading"
      @submit="handleStatusSubmit"
      @close="closeStatusDialog"
    />
  </DashboardLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import DashboardLayout from '../../../components/DashboardLayout.vue';
import { useVehicleStore } from '../stores/vehicleStore.js';
import VehicleDialog from '../components/VehicleDialog.vue';
import StatusDialog from '../components/StatusDialog.vue';

const vehicleStore = useVehicleStore();

const currentPage = ref(1);
const itemsPerPage = ref(10);
const itemsPerPageOptions = [5, 10, 25, 50];

const headers = [
  { title: 'Marca', key: 'mark', sortable: true },
  { title: 'Modelo', key: 'model', sortable: true },
  { title: 'Año', key: 'year', sortable: true },
  { title: 'Estado', key: 'status', sortable: true },
  { title: 'Acciones', key: 'actions', sortable: false, align: 'end' }
];

const showVehicleDialog = ref(false);
const showStatusDialog = ref(false);
const selectedVehicle = ref(null);
const statusLoading = ref(false);

const loadVehicles = async () => {
  await vehicleStore.fetchVehicles(
    currentPage.value,
    itemsPerPage.value
  );
};

const handlePageChange = (page) => {
  currentPage.value = page;
  loadVehicles();
};

const handleItemsPerPageChange = (newItemsPerPage) => {
  itemsPerPage.value = newItemsPerPage;
  currentPage.value = 1;
  loadVehicles();
};

const openCreateDialog = () => {
  selectedVehicle.value = null;
  showVehicleDialog.value = true;
};

const closeVehicleDialog = () => {
  selectedVehicle.value = null;
  showVehicleDialog.value = false;
};

const handleVehicleSubmit = async (vehicleData) => {
  const result = await vehicleStore.createVehicle(vehicleData);
  if (result.success) {
    closeVehicleDialog();
    await loadVehicles();
  } else {
    // El error se mostrará en el dialog a través del store
    console.error('Error al crear vehículo:', result.message);
  }
};

const openStatusDialog = (vehicle) => {
  selectedVehicle.value = vehicle;
  showStatusDialog.value = true;
};

const closeStatusDialog = () => {
  selectedVehicle.value = null;
  showStatusDialog.value = false;
};

const handleStatusSubmit = async (status) => {
  if (!selectedVehicle.value) return;
  
  statusLoading.value = true;
  const result = await vehicleStore.updateVehicleStatus(
    selectedVehicle.value._id,
    status
  );
  
  if (result.success) {
    closeStatusDialog();
    await loadVehicles();
  }
  
  statusLoading.value = false;
};

const getStatusColor = (status) => {
  const colors = {
    available: 'success',
    maintenance: 'error',
    service: 'warning'
  };
  return colors[status] || 'grey';
};

const getStatusLabel = (status) => {
  const labels = {
    available: 'Disponible',
    maintenance: 'Mantenimiento',
    service: 'Servicio'
  };
  return labels[status] || status;
};

onMounted(() => {
  loadVehicles();
});
</script>

<style scoped>
/* Estilos específicos si son necesarios */
</style>

