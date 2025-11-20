<template>
  <v-dialog
    v-model="dialog"
    max-width="500px"
    persistent
  >
    <v-card>
      <v-card-title class="d-flex align-center justify-space-between">
        <span class="text-h6 font-weight-bold">
          {{ title }}
        </span>
        <v-btn
          icon
          variant="text"
          size="small"
          @click="closeDialog"
          :disabled="loading"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="pt-6">
        <div class="d-flex align-center mb-4">
          <v-icon
            :color="iconColor"
            size="48"
            class="mr-4"
          >
            {{ icon }}
          </v-icon>
          <p class="text-body-1">
            {{ message }}
          </p>
        </div>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          variant="outlined"
          @click="closeDialog"
          :disabled="loading"
        >
          {{ cancelText }}
        </v-btn>
        <v-btn
          :color="confirmColor"
          variant="flat"
          @click="handleConfirm"
          :loading="loading"
          :disabled="loading"
        >
          {{ confirmText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch, computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'Confirmar Acción'
  },
  message: {
    type: String,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  confirmText: {
    type: String,
    default: 'Confirmar'
  },
  cancelText: {
    type: String,
    default: 'Cancelar'
  },
  confirmColor: {
    type: String,
    default: 'error'
  },
  icon: {
    type: String,
    default: 'mdi-alert-circle'
  },
  iconColor: {
    type: String,
    default: 'error'
  }
});

const emit = defineEmits(['update:modelValue', 'confirm', 'close']);

const dialog = ref(props.modelValue);

// Watch para sincronizar dialog con modelValue
watch(() => props.modelValue, (newVal) => {
  dialog.value = newVal;
});

watch(dialog, (newVal) => {
  emit('update:modelValue', newVal);
  if (!newVal) {
    emit('close');
  }
});

const closeDialog = () => {
  if (!props.loading) {
    dialog.value = false;
  }
};

const handleConfirm = () => {
  if (!props.loading) {
    emit('confirm');
  }
};
</script>

<style scoped>
/* Estilos específicos si son necesarios */
</style>

