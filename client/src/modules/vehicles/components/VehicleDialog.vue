<template>
  <v-dialog
    v-model="dialog"
    max-width="600px"
    persistent
  >
    <v-card>
      <v-card-title class="d-flex align-center justify-space-between">
        <span class="text-h6 font-weight-bold">
          {{ isEdit ? 'Editar Vehículo' : 'Registrar Vehículo' }}
        </span>
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
        <Form
          :key="formKey"
          @submit="onSubmit"
          :validation-schema="vehicleSchema"
          :initial-values="initialValues"
          v-slot="{ errors: formErrors, setFieldValue }"
        >
          <Field name="mark" v-slot="{ field, errorMessage }">
            <v-select
              :model-value="field.value"
              @update:model-value="(value) => {
                field.onChange(value);
                handleMarkChange(value, setFieldValue);
              }"
              @blur="field.onBlur"
              label="Marca"
              :items="markOptions"
              prepend-inner-icon="mdi-car-sports"
              variant="outlined"
              color="primary"
              :error-messages="errorMessage"
              class="mb-4"
              density="comfortable"
              autofocus
              :disabled="loading"
            />
          </Field>

          <Field name="model" v-slot="{ field, errorMessage }">
            <v-select
              :model-value="field.value"
              @update:model-value="field.onChange"
              @blur="field.onBlur"
              label="Modelo"
              :items="availableModels"
              prepend-inner-icon="mdi-car"
              variant="outlined"
              color="primary"
              :error-messages="errorMessage"
              class="mb-4"
              density="comfortable"
              :disabled="!selectedMark || loading"
              :placeholder="selectedMark ? 'Seleccione un modelo' : 'Primero seleccione una marca'"
            />
          </Field>

          <Field name="year" v-slot="{ field, errorMessage }">
            <div class="d-flex mb-4" style="gap: 12px;">
              <v-select
                v-model="selectedMonth"
                :items="monthOptions"
                label="Mes"
                prepend-inner-icon="mdi-calendar-month"
                variant="outlined"
                color="primary"
                density="comfortable"
                style="flex: 1;"
                @update:model-value="() => handleMonthYearChange(setFieldValue)"
              ></v-select>
              
              <v-select
                v-model="selectedYear"
                :items="yearOptions"
                label="Año"
                prepend-inner-icon="mdi-calendar"
                variant="outlined"
                color="primary"
                density="comfortable"
                style="flex: 1;"
                :error-messages="errorMessage"
                @update:model-value="() => handleMonthYearChange(setFieldValue)"
              ></v-select>
            </div>
            <!-- Campo oculto para mantener el valor del año en el formulario -->
            <input type="hidden" v-bind="field" />
          </Field>

          <Field name="status" v-slot="{ field, errorMessage }">
            <v-select
              :model-value="field.value"
              @update:model-value="field.onChange"
              @blur="field.onBlur"
              label="Estado"
              :items="statusOptions"
              prepend-inner-icon="mdi-information"
              variant="outlined"
              color="primary"
              :error-messages="errorMessage"
              class="mb-4"
              density="comfortable"
              hide-details="auto"
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
          </Field>

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

          <v-card-actions class="pa-0">
            <v-spacer></v-spacer>
            <v-btn
              variant="outlined"
              @click="closeDialog"
              :disabled="loading"
            >
              Cancelar
            </v-btn>
            <v-btn
              type="submit"
              variant="flat"
              color="primary"
              :loading="loading"
              :disabled="loading"
            >
              {{ isEdit ? 'Actualizar' : 'Registrar' }}
            </v-btn>
          </v-card-actions>
        </Form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch, computed, onMounted, nextTick } from 'vue';
import { Form, Field } from 'vee-validate';
import { vehicleSchema } from '../schemas/vehicleSchema.js';
import { useVehicleMarkStore } from '../stores/vehicleMarkStore.js';

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
  },
  error: {
    type: String,
    default: null
  }
});

const emit = defineEmits(['update:modelValue', 'submit', 'close']);

// Store de marcas y modelos
const vehicleMarkStore = useVehicleMarkStore();

// Inicializar todas las refs primero
const dialog = ref(props.modelValue);
const errorMessage = ref('');
const selectedMonth = ref(null);
const selectedYear = ref(null);
const formKey = ref(0);
const selectedMark = ref(null);
const availableModels = ref([]);

// Opciones de marcas desde el store
const markOptions = computed(() => {
  return vehicleMarkStore.marks.map(mark => ({
    title: mark.name,
    value: mark._id
  }));
});

// Computed después de las refs
const isEdit = computed(() => !!props.vehicle);

// Valores iniciales del formulario
const initialValues = computed(() => {
  if (props.vehicle) {
    // Si el vehículo tiene mark y model como objetos poblados, usar sus _id
    const markId = props.vehicle.mark?._id || props.vehicle.mark || '';
    const modelId = props.vehicle.model?._id || props.vehicle.model || '';
    
    return {
      mark: markId,
      model: modelId,
      year: props.vehicle.year?.toString() || '',
      status: props.vehicle.status || 'available'
    };
  }
  return {
    mark: '',
    model: '',
    year: '',
    status: 'available'
  };
});

// Handler para cuando cambia la marca (cascada)
const handleMarkChange = async (markId, setFieldValue) => {
  // Actualizar la marca seleccionada
  selectedMark.value = markId;
  
  // Limpiar el modelo cuando cambia la marca
  if (setFieldValue) {
    setFieldValue('model', '');
  }
  
  // Cargar modelos de la marca seleccionada
  if (markId) {
    const result = await vehicleMarkStore.fetchModelsByMark(markId);
    if (result.success) {
      availableModels.value = result.data.map(model => ({
        title: model.name,
        value: model._id
      }));
    } else {
      availableModels.value = [];
    }
  } else {
    availableModels.value = [];
  }
};

// Opciones de meses en español
const monthOptions = [
  { title: 'Enero', value: 1 },
  { title: 'Febrero', value: 2 },
  { title: 'Marzo', value: 3 },
  { title: 'Abril', value: 4 },
  { title: 'Mayo', value: 5 },
  { title: 'Junio', value: 6 },
  { title: 'Julio', value: 7 },
  { title: 'Agosto', value: 8 },
  { title: 'Septiembre', value: 9 },
  { title: 'Octubre', value: 10 },
  { title: 'Noviembre', value: 11 },
  { title: 'Diciembre', value: 12 }
];

// Opciones de años (desde 1900 hasta el año actual)
const yearOptions = computed(() => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let year = currentYear; year >= 1900; year--) {
    years.push({ title: year.toString(), value: year });
  }
  return years;
});

const handleMonthYearChange = (setFieldValue) => {
  if (!setFieldValue) {
    return;
  }

  // Si no hay año seleccionado, limpiar el campo
  if (!selectedYear.value) {
    setFieldValue('year', '');
    errorMessage.value = '';
    return;
  }

  // Si hay mes y año, validar
  if (selectedMonth.value && selectedYear.value) {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    // Validar que no sea una fecha futura
    if (
      selectedYear.value > currentYear ||
      (selectedYear.value === currentYear && selectedMonth.value > currentMonth)
    ) {
      errorMessage.value = 'No se puede seleccionar una fecha futura';
      setFieldValue('year', '');
      return;
    }

    // Actualizar el valor del año en el formulario
    setFieldValue('year', selectedYear.value.toString());
    errorMessage.value = '';
  }
};

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

// Watch para sincronizar dialog con modelValue
watch(() => props.modelValue, async (newVal) => {
  dialog.value = newVal;
  if (newVal) {
    // Forzar re-render del formulario cuando se abre el dialog
    formKey.value += 1;
    // Cuando se abre el dialog, inicializar valores
    await nextTick();
    
    // Inicializar marca si hay vehículo
    if (props.vehicle?.mark) {
      const markId = props.vehicle.mark?._id || props.vehicle.mark;
      selectedMark.value = markId;
      
      // Cargar modelos de la marca
      if (markId) {
        const result = await vehicleMarkStore.fetchModelsByMark(markId);
        if (result.success) {
          availableModels.value = result.data.map(model => ({
            title: model.name,
            value: model._id
          }));
        }
      }
    } else {
      selectedMark.value = null;
      availableModels.value = [];
    }
    
    if (props.vehicle?.year) {
      selectedYear.value = props.vehicle.year;
      selectedMonth.value = 1; // Enero por defecto
    } else {
      selectedYear.value = null;
      selectedMonth.value = null;
    }
  } else {
    // Cuando se cierra, limpiar valores
    errorMessage.value = '';
    selectedYear.value = null;
    selectedMonth.value = null;
    selectedMark.value = null;
    availableModels.value = [];
  }
});

// Watch para cuando cambia el vehículo
watch(() => props.vehicle, async (newVehicle) => {
  if (newVehicle && dialog.value) {
    await nextTick();
    
    // Inicializar marca
    if (newVehicle.mark) {
      const markId = newVehicle.mark?._id || newVehicle.mark;
      selectedMark.value = markId;
      
      // Cargar modelos de la marca
      if (markId) {
        const result = await vehicleMarkStore.fetchModelsByMark(markId);
        if (result.success) {
          availableModels.value = result.data.map(model => ({
            title: model.name,
            value: model._id
          }));
        }
      }
    }
    
    // Inicializar año
    if (newVehicle.year) {
      selectedYear.value = newVehicle.year;
      selectedMonth.value = 1; // Enero por defecto
    }
  }
});

// Cargar marcas al montar el componente
onMounted(async () => {
  await vehicleMarkStore.fetchMarks();
});

watch(() => props.error, (newError) => {
  if (newError) {
    errorMessage.value = newError;
  }
});

watch(() => props.loading, (isLoading) => {
  if (!isLoading && !props.error) {
    errorMessage.value = '';
  }
});

watch(dialog, (newVal) => {
  emit('update:modelValue', newVal);
  if (!newVal) {
    emit('close');
  }
});

const onSubmit = (values) => {
  errorMessage.value = '';
  // Convertir año a número
  const vehicleData = {
    ...values,
    year: parseInt(values.year)
  };
  emit('submit', vehicleData);
};

const closeDialog = () => {
  dialog.value = false;
};
</script>

<style scoped>
/* Estilos específicos si son necesarios */
</style>
