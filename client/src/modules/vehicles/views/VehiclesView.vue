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

        <!-- Filtros de búsqueda -->
        <v-card class="mb-4" variant="outlined">
          <v-card-title class="text-subtitle-1 font-weight-medium">
            <v-icon class="mr-2">mdi-filter</v-icon>
            Filtros de Búsqueda
          </v-card-title>
          <v-card-text>
            <v-row align="start">
              <v-col cols="12" md="5">
                <v-text-field
                  v-model="filters.search"
                  label="Buscar"
                  placeholder="Buscar por marca, modelo o ID único"
                  prepend-inner-icon="mdi-magnify"
                  variant="outlined"
                  density="compact"
                  clearable
                  @update:model-value="handleSearchChange"
                />
              </v-col>
              <v-col cols="12" md="2">
                <v-select
                  v-model="filters.yearFrom"
                  :items="yearOptions"
                  label="Año Desde"
                  prepend-inner-icon="mdi-calendar-start"
                  variant="outlined"
                  density="compact"
                  clearable
                  @update:model-value="handleYearFilterChange"
                />
              </v-col>
              <v-col cols="12" md="2">
                <v-select
                  v-model="filters.yearTo"
                  :items="yearOptions"
                  label="Año Hasta"
                  prepend-inner-icon="mdi-calendar-end"
                  variant="outlined"
                  density="compact"
                  clearable
                  @update:model-value="handleYearFilterChange"
                />
              </v-col>
              <v-col cols="12" md="3" class="d-flex align-end">
                <v-btn
                  color="secondary"
                  variant="outlined"
                  prepend-icon="mdi-close-circle"
                  @click="clearFilters"
                  density="compact"
                  height="40"
                >
                  Limpiar Filtros
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <v-data-table-server
          :headers="headers"
          :items="vehicleStore.vehicles"
          :loading="vehicleStore.loading"
          :items-per-page="itemsPerPage"
          :page="currentPage"
          :items-length="vehicleStore.total"
          :items-per-page-options="itemsPerPageOptions"
          :sort-by="[{ key: sortBy, order: sortOrder }]"
          @update:page="handlePageChange"
          @update:items-per-page="handleItemsPerPageChange"
          @update:options="handleOptionsChange"
          class="elevation-2"
        >
          <template v-slot:item.mark="{ item }">
            {{ item.mark?.name || item.mark || '-' }}
          </template>

          <template v-slot:item.model="{ item }">
            {{ item.model?.name || item.model || '-' }}
          </template>

          <template v-slot:item.actions="{ item }">
            <v-menu>
              <template v-slot:activator="{ props }">
                <v-btn
                  icon
                  variant="text"
                  size="small"
                  v-bind="props"
                >
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item
                  prepend-icon="mdi-pencil"
                  title="Editar"
                  @click="handleEdit(item)"
                />
                <v-list-item
                  prepend-icon="mdi-delete"
                  title="Eliminar"
                  @click="handleDelete(item)"
                />
              </v-list>
            </v-menu>
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

    <!-- Dialog de confirmación para eliminar -->
    <ConfirmDialog
      v-model="showDeleteConfirmDialog"
      title="Confirmar Eliminación"
      :message="deleteConfirmMessage"
      :loading="vehicleStore.loading"
      confirm-text="Eliminar"
      cancel-text="Cancelar"
      confirm-color="error"
      icon="mdi-delete-alert"
      icon-color="error"
      @confirm="confirmDelete"
      @close="closeDeleteDialog"
    />

    <!-- Snackbar para mensajes de éxito/error -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="3000"
      location="bottom right"
    >
      {{ snackbar.message }}
      <template v-slot:actions>
        <v-btn
          variant="text"
          @click="snackbar.show = false"
        >
          Cerrar
        </v-btn>
      </template>
    </v-snackbar>
  </DashboardLayout>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import DashboardLayout from '../../../components/DashboardLayout.vue';
import { useVehicleStore } from '../stores/vehicleStore.js';
import VehicleDialog from '../components/VehicleDialog.vue';
import ConfirmDialog from '../components/ConfirmDialog.vue';

const vehicleStore = useVehicleStore();

const currentPage = ref(1);
const itemsPerPage = ref(10);
const itemsPerPageOptions = [5, 10, 25, 50];
const sortBy = ref('vehicleId');
const sortOrder = ref('asc');

const filters = ref({
  search: '',
  yearFrom: null, // Número del año
  yearTo: null // Número del año
});

const headers = [
  { title: 'ID Único', key: 'vehicleId', sortable: true },
  { title: 'Marca', key: 'mark', sortable: true },
  { title: 'Modelo', key: 'model', sortable: true },
  { title: 'Año de Fabricación', key: 'year', sortable: true },
  { title: 'Acciones', key: 'actions', sortable: false, align: 'end' }
];

const showVehicleDialog = ref(false);
const selectedVehicle = ref(null);
const showDeleteConfirmDialog = ref(false);
const vehicleToDelete = ref(null);

// Snackbar para mensajes
const snackbar = ref({
  show: false,
  message: '',
  color: 'success'
});

// Generar opciones de años (desde 1900 hasta el año actual + 1)
const yearOptions = (() => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let year = currentYear + 1; year >= 1900; year--) {
    years.push({ title: year.toString(), value: year });
  }
  return years;
})();

const loadVehicles = async () => {
  // Preparar filtros para enviar (solo los que tienen valor)
  const filtersToSend = {
    search: filters.value.search || undefined,
    yearFrom: filters.value.yearFrom || undefined,
    yearTo: filters.value.yearTo || undefined
  };

  // Asegurar que siempre se envíen los parámetros de ordenamiento
  await vehicleStore.fetchVehicles(
    currentPage.value,
    itemsPerPage.value,
    sortBy.value || 'vehicleId',
    sortOrder.value || 'asc',
    filtersToSend
  );
};

// Timeout para el debounce del input de búsqueda
let searchDebounceTimer = null;

// Handler para el input de búsqueda con debounce
const handleSearchChange = () => {
  // Limpiar el timer anterior si existe
  if (searchDebounceTimer) {
    clearTimeout(searchDebounceTimer);
  }

  // Crear un nuevo timer para ejecutar la búsqueda después de 500ms
  searchDebounceTimer = setTimeout(() => {
    currentPage.value = 1;
    loadVehicles();
  }, 500);
};

// Handler para los filtros de año (sin debounce, se ejecutan inmediatamente)
const handleYearFilterChange = () => {
  // Resetear a la primera página cuando cambian los filtros
  currentPage.value = 1;
  loadVehicles();
};

const clearFilters = () => {
  // Limpiar el timer de debounce si existe
  if (searchDebounceTimer) {
    clearTimeout(searchDebounceTimer);
    searchDebounceTimer = null;
  }

  filters.value = {
    search: '',
    yearFrom: null,
    yearTo: null
  };
  currentPage.value = 1;
  loadVehicles();
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

const handleOptionsChange = (options) => {
  // Manejar cambios en ordenamiento desde v-data-table-server
  // El objeto options contiene: { page, itemsPerPage, sortBy, groupBy }
  let shouldReload = false;

  // Actualizar página si cambió
  if (options.page !== undefined && options.page !== currentPage.value) {
    currentPage.value = options.page;
    shouldReload = true;
  }

  // Actualizar items por página si cambió
  if (options.itemsPerPage !== undefined && options.itemsPerPage !== itemsPerPage.value) {
    itemsPerPage.value = options.itemsPerPage;
    currentPage.value = 1; // Resetear a la primera página
    shouldReload = true;
  }

  // Actualizar ordenamiento si cambió
  if (options.sortBy && options.sortBy.length > 0) {
    const newSortBy = options.sortBy[0].key;
    const newSortOrder = options.sortBy[0].order === 'asc' ? 'asc' : 'desc';
    
    if (sortBy.value !== newSortBy || sortOrder.value !== newSortOrder) {
      sortBy.value = newSortBy;
      sortOrder.value = newSortOrder;
      currentPage.value = 1; // Resetear a la primera página cuando cambia el ordenamiento
      shouldReload = true;
    }
  } else {
    // Si no hay ordenamiento seleccionado, usar el ordenamiento por defecto
    if (sortBy.value !== 'vehicleId' || sortOrder.value !== 'asc') {
      sortBy.value = 'vehicleId';
      sortOrder.value = 'asc';
      currentPage.value = 1;
      shouldReload = true;
    }
  }

  // Recargar solo si hubo cambios
  if (shouldReload) {
    loadVehicles();
  }
};

const openCreateDialog = () => {
  selectedVehicle.value = null;
  showVehicleDialog.value = true;
};

const closeVehicleDialog = () => {
  selectedVehicle.value = null;
  showVehicleDialog.value = false;
  // Limpiar error del store al cerrar el dialog
  vehicleStore.error = null;
};

const handleVehicleSubmit = async (vehicleData) => {
  // Limpiar error del store antes de la operación
  vehicleStore.error = null;
  
  // Si hay un vehículo seleccionado, es una actualización
  if (selectedVehicle.value) {
    const result = await vehicleStore.updateVehicle(selectedVehicle.value._id, vehicleData);
    if (result.success) {
      snackbar.value = {
        show: true,
        message: 'Vehículo actualizado exitosamente',
        color: 'success'
      };
      closeVehicleDialog();
      await loadVehicles();
    } else {
      snackbar.value = {
        show: true,
        message: result.message || 'Error al actualizar el vehículo',
        color: 'error'
      };
    }
  } else {
    // Si no hay vehículo seleccionado, es una creación
    const result = await vehicleStore.createVehicle(vehicleData);
    if (result.success) {
      snackbar.value = {
        show: true,
        message: 'Vehículo creado exitosamente',
        color: 'success'
      };
      closeVehicleDialog();
      await loadVehicles();
    } else {
      snackbar.value = {
        show: true,
        message: result.message || 'Error al crear el vehículo',
        color: 'error'
      };
    }
  }
};

const handleEdit = (vehicle) => {
  selectedVehicle.value = vehicle;
  showVehicleDialog.value = true;
};

// Mensaje de confirmación para eliminar
const deleteConfirmMessage = computed(() => {
  if (vehicleToDelete.value) {
    const markName = vehicleToDelete.value.mark?.name || vehicleToDelete.value.mark || '';
    const modelName = vehicleToDelete.value.model?.name || vehicleToDelete.value.model || '';
    return `¿Estás seguro de que deseas eliminar el vehículo ${vehicleToDelete.value.vehicleId} (${markName} ${modelName})? Esta acción no se puede deshacer.`;
  }
  return '';
});

const handleDelete = (vehicle) => {
  vehicleToDelete.value = vehicle;
  showDeleteConfirmDialog.value = true;
};

const closeDeleteDialog = () => {
  if (!vehicleStore.loading) {
    showDeleteConfirmDialog.value = false;
    vehicleToDelete.value = null;
  }
};

const confirmDelete = async () => {
  if (!vehicleToDelete.value) return;

  // Limpiar error del store antes de la operación
  vehicleStore.error = null;

  const result = await vehicleStore.deleteVehicle(vehicleToDelete.value._id);
  if (result.success) {
    snackbar.value = {
      show: true,
      message: 'Vehículo eliminado exitosamente',
      color: 'success'
    };
    closeDeleteDialog();
    await loadVehicles();
  } else {
    snackbar.value = {
      show: true,
      message: result.message || 'Error al eliminar el vehículo',
      color: 'error'
    };
  }
};


onMounted(() => {
  loadVehicles();
});
</script>

<style scoped>
/* Estilos específicos si son necesarios */
</style>

