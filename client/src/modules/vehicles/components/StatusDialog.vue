<template>
  <v-dialog
    v-model="dialog"
    max-width="400px"
    persistent
  >
    <v-card>
      <v-card-title class="d-flex align-center justify-space-between">
        <span class="text-h6 font-weight-bold">Cambiar Estado</span>
        <v-btn
          icon
          variant="text"
          size="small"
          @click="closeDialog"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="pt-6">
        <div class="mb-4">
          <p class="text-body-2 text-grey mb-2">Vehículo:</p>
          <p class="text-body-1 font-weight-medium">
            {{ vehicle?.mark }} {{ vehicle?.model }} ({{ vehicle?.year }})
          </p>
          <p class="text-body-2 text-grey mt-2">Estado actual:</p>
          <v-chip
            :color="getStatusColor(vehicle?.status)"
            size="small"
            variant="flat"
            class="mt-1"
          >
            {{ getStatusLabel(vehicle?.status) }}
          </v-chip>
        </div>

        <v-select
          v-model="selectedStatus"
          label="Nuevo Estado"
          :items="statusOptions"
          variant="outlined"
          color="primary"
          density="comfortable"
        >
          <template v-slot:item="{ props, item }">
            <v-list-item v-bind="props">
              <template v-slot:prepend>
                <v-chip
                  :color="getStatusColor(item.raw.value)"
                  size="small"
                  variant="flat"
                  class="mr-2"
                >
                  {{ item.raw.title }}
                </v-chip>
              </template>
            </v-list-item>
          </template>
        </v-select>

        <v-alert
          v-if="errorMessage"
          type="error"
          variant="tonal"
          class="mt-4"
          closable
          @click:close="errorMessage = ''"
        >
          {{ errorMessage }}
        </v-alert>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          variant="text"
          @click="closeDialog"
          :disabled="loading"
        >
          Cancelar
        </v-btn>
        <v-btn
          color="primary"
          @click="handleSubmit"
          :loading="loading"
          :disabled="loading || !selectedStatus || selectedStatus === vehicle?.status"
        >
          Actualizar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  vehicle: {
    type: Object,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue', 'submit', 'close']);

const dialog = ref(props.modelValue);
const selectedStatus = ref(null);
const errorMessage = ref('');

const statusOptions = [
  { title: 'Disponible', value: 'available' },
  { title: 'Mantenimiento', value: 'maintenance' },
  { title: 'Servicio', value: 'service' }
];

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

watch(() => props.modelValue, (newVal) => {
  dialog.value = newVal;
  if (newVal && props.vehicle) {
    selectedStatus.value = props.vehicle.status;
  } else {
    selectedStatus.value = null;
    errorMessage.value = '';
  }
});

watch(dialog, (newVal) => {
  emit('update:modelValue', newVal);
  if (!newVal) {
    emit('close');
  }
});

const handleSubmit = () => {
  if (!selectedStatus.value || selectedStatus.value === props.vehicle?.status) {
    return;
  }
  errorMessage.value = '';
  emit('submit', selectedStatus.value);
};

const closeDialog = () => {
  dialog.value = false;
};
</script>

<style scoped>
/* Estilos específicos si son necesarios */
</style>

