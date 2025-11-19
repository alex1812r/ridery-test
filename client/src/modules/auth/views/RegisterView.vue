<template>
  <v-container fluid class="register-view">
    <v-row class="fill-height register-row" align="center" justify="center">
      <v-col cols="12" sm="8" md="5" lg="4">
        <v-card class="elevation-12" rounded="xl">
          <v-card-item class="register-card__header">
            <div class="text-center pa-6">
              <v-icon color="white" size="72">mdi-account-plus</v-icon>
              <h1 class="register-card__title">Ridery</h1>
              <p class="register-card__subtitle">Crea tu cuenta para comenzar</p>
            </div>
          </v-card-item>

          <v-card-text class="pa-8">
            <Form @submit="onSubmit" :validation-schema="registerSchema">
              <Field name="email" v-slot="{ value, handleChange, handleBlur, errorMessage }">
                <v-text-field
                  :model-value="value"
                  @update:model-value="handleChange"
                  @blur="handleBlur"
                  label="Correo electrónico"
                  type="email"
                  prepend-inner-icon="mdi-email-outline"
                  variant="outlined"
                  color="primary"
                  :error-messages="errorMessage"
                  autocomplete="email"
                  class="mb-4"
                  density="comfortable"
                />
              </Field>

              <Field name="password" v-slot="{ value, handleChange, handleBlur, errorMessage }">
                <v-text-field
                  :model-value="value"
                  @update:model-value="handleChange"
                  @blur="handleBlur"
                  label="Contraseña"
                  :type="showPassword ? 'text' : 'password'"
                  prepend-inner-icon="mdi-lock-outline"
                  :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  variant="outlined"
                  color="primary"
                  :error-messages="errorMessage"
                  :hint="passwordHint(value)"
                  persistent-hint
                  autocomplete="new-password"
                  class="mb-4"
                  density="comfortable"
                  @click:append-inner="showPassword = !showPassword"
                />
              </Field>

              <Field name="confirmPassword" v-slot="{ value, handleChange, handleBlur, errorMessage }">
                <v-text-field
                  :model-value="value"
                  @update:model-value="handleChange"
                  @blur="handleBlur"
                  label="Confirmar contraseña"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  prepend-inner-icon="mdi-lock-check-outline"
                  :append-inner-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  variant="outlined"
                  color="primary"
                  :error-messages="errorMessage"
                  autocomplete="new-password"
                  class="mb-2"
                  density="comfortable"
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
                <v-icon start>mdi-account-plus</v-icon>
                Crear Cuenta
              </v-btn>
            </Form>
          </v-card-text>

          <v-card-actions class="justify-center pa-6">
            <span class="text-body-2 mr-2">¿Ya tienes cuenta?</span>
            <v-btn variant="text" color="primary" :to="{ name: 'Login' }">
              Inicia sesión
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Form, Field } from 'vee-validate';
import { useAuthStore } from '../../../core/stores/authStore.js';
import { registerSchema } from '../schemas/registerSchema.js';

const router = useRouter();
const authStore = useAuthStore();

const showPassword = ref(false);
const showConfirmPassword = ref(false);
const loading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

const passwordHint = (password) => {
  if (!password) return 'Mínimo 6 caracteres';
  
  if (password.length >= 6) {
    return 'Contraseña válida';
  }
  
  return `Faltan ${6 - password.length} caracteres`;
};

const onSubmit = async (values) => {
  errorMessage.value = '';
  successMessage.value = '';
  loading.value = true;

  try {
    const result = await authStore.register(values.email, values.password);

    if (result.success) {
      successMessage.value = 'Cuenta creada exitosamente. Redirigiendo...';
      setTimeout(() => {
        router.push({ name: 'Dashboard' });
      }, 1000);
    } else {
      errorMessage.value = result.message || 'Error al registrar usuario';
    }
  } catch (error) {
    errorMessage.value = 'Error de conexión. Intenta nuevamente.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.register-view {
  min-height: 100vh;
  background: #f5f7fa;
  padding: 16px;
}

.register-row {
  min-height: calc(100vh - 32px);
}

.register-card__header {
  background: linear-gradient(135deg, #3bd4ae 0%, #2a9d8f 100%);
  color: white;
}

.register-card__title {
  margin: 16px 0 8px;
  font-size: 2rem;
  color: white;
  font-weight: 700;
}

.register-card__subtitle {
  margin: 0;
  opacity: 0.95;
  color: white;
  font-size: 1rem;
}

/* Asegurar centrado vertical en móviles y tablets */
@media (max-width: 960px) {
  .register-view {
    padding: 16px;
  }

  .register-row {
    min-height: calc(100vh - 32px);
  }
}
</style>
