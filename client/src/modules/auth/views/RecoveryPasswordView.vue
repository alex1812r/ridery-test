<template>
  <v-container fluid class="recovery-password-view">
    <v-row class="fill-height recovery-password-row" align="center" justify="center">
      <v-col cols="12" sm="8" md="5" lg="4">
        <v-card class="elevation-12" rounded="xl">
          <v-card-item class="recovery-password-card__header">
            <div class="text-center pa-6">
              <v-icon color="white" size="72">mdi-key-variant</v-icon>
              <h1 class="recovery-password-card__title">Ridery</h1>
              <p class="recovery-password-card__subtitle">Restablecer contraseña</p>
            </div>
          </v-card-item>

          <v-card-text class="pa-8">
            <Form @submit="onSubmit" :validation-schema="recoveryPasswordSchema" :initial-values="initialValues">
              <Field name="newPassword" v-slot="{ value, handleChange, handleBlur, errorMessage }">
                <v-text-field
                  :model-value="value"
                  @update:model-value="handleChange"
                  @blur="handleBlur"
                  label="Nueva Contraseña"
                  :type="showPassword ? 'text' : 'password'"
                  prepend-inner-icon="mdi-lock-outline"
                  :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  variant="outlined"
                  color="primary"
                  :error-messages="errorMessage"
                  autocomplete="new-password"
                  class="mb-4"
                  density="comfortable"
                  :disabled="loading"
                  @click:append-inner="showPassword = !showPassword"
                />
              </Field>

              <Field name="confirmPassword" v-slot="{ value, handleChange, handleBlur, errorMessage }">
                <v-text-field
                  :model-value="value"
                  @update:model-value="handleChange"
                  @blur="handleBlur"
                  label="Confirmar Nueva Contraseña"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  prepend-inner-icon="mdi-lock-check-outline"
                  :append-inner-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  variant="outlined"
                  color="primary"
                  :error-messages="errorMessage"
                  autocomplete="new-password"
                  class="mb-4"
                  density="comfortable"
                  :disabled="loading"
                  @click:append-inner="showConfirmPassword = !showConfirmPassword"
                />
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

              <v-alert
                v-if="successMessage"
                type="success"
                variant="tonal"
                class="mb-4"
              >
                {{ successMessage }}
              </v-alert>

              <v-btn
                type="submit"
                color="primary"
                size="large"
                block
                :loading="loading"
                :disabled="loading"
              >
                <v-icon start>mdi-check-circle</v-icon>
                Restablecer Contraseña
              </v-btn>
            </Form>
          </v-card-text>

          <v-card-actions class="justify-center pa-6">
            <v-btn variant="text" color="primary" :to="{ name: 'Login' }">
              <v-icon start>mdi-arrow-left</v-icon>
              Volver al inicio de sesión
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { Form, Field } from 'vee-validate';
import { useAuthStore } from '../../../core/stores/authStore.js';
import { recoveryPasswordSchema } from '../schemas/recoveryPasswordSchema.js';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const loading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');
const showPassword = ref(false);
const showConfirmPassword = ref(false);

// Obtener el token de la URL
const token = computed(() => route.query.token || '');

const initialValues = computed(() => ({
  token: token.value
}));

onMounted(() => {
  // Si no hay token en la URL, redirigir al login
  if (!token.value) {
    router.push({ name: 'Login' });
  }
});

const onSubmit = async (values) => {
  if (!token.value) {
    errorMessage.value = 'Token de recuperación no válido o faltante';
    return;
  }

  errorMessage.value = '';
  successMessage.value = '';
  loading.value = true;

  try {
    const result = await authStore.recoveryPassword(token.value, values.newPassword);

    if (result.success) {
      successMessage.value = result.data?.message || 'Contraseña restablecida exitosamente';
      // Redirigir al login después de 2 segundos
      setTimeout(() => {
        router.push({ name: 'Login' });
      }, 2000);
    } else {
      errorMessage.value = result.message || 'Error al restablecer la contraseña';
    }
  } catch (error) {
    errorMessage.value = 'Error de conexión. Intenta nuevamente.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.recovery-password-view {
  min-height: 100vh;
  background: #f5f7fa;
  padding: 16px;
}

.recovery-password-row {
  min-height: calc(100vh - 32px);
}

.recovery-password-card__header {
  background: linear-gradient(135deg, #3bd4ae 0%, #2a9d8f 100%);
  color: white;
}

.recovery-password-card__title {
  margin: 16px 0 8px;
  font-size: 2rem;
  color: white;
  font-weight: 700;
}

.recovery-password-card__subtitle {
  margin: 0;
  opacity: 0.95;
  color: white;
  font-size: 1rem;
}

@media (max-width: 960px) {
  .recovery-password-view {
    padding: 16px;
  }

  .recovery-password-row {
    min-height: calc(100vh - 32px);
  }
}
</style>

