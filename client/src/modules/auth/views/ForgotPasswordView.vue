<template>
  <v-container fluid class="forgot-password-view">
    <v-row class="fill-height forgot-password-row" align="center" justify="center">
      <v-col cols="12" sm="8" md="5" lg="4">
        <v-card class="elevation-12" rounded="xl">
          <v-card-item class="forgot-password-card__header">
            <div class="text-center pa-6">
              <v-icon color="white" size="72">mdi-lock-reset</v-icon>
              <h1 class="forgot-password-card__title">Ridery</h1>
              <p class="forgot-password-card__subtitle">Recuperar contraseña</p>
            </div>
          </v-card-item>

          <v-card-text class="pa-8">
            <Form @submit="onSubmit" :validation-schema="forgotPasswordSchema">
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
                  :disabled="loading || isSuccess"
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
                :disabled="loading || isSuccess"
              >
                <v-icon start>mdi-email-send</v-icon>
                Enviar enlace de recuperación
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
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Form, Field } from 'vee-validate';
import { useAuthStore } from '../../../core/stores/authStore.js';
import { forgotPasswordSchema } from '../schemas/forgotPasswordSchema.js';

const router = useRouter();
const authStore = useAuthStore();

const loading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');
const isSuccess = ref(false);

const onSubmit = async (values) => {
  errorMessage.value = '';
  successMessage.value = '';
  loading.value = true;
  isSuccess.value = false;

  try {
    const result = await authStore.forgotPassword(values.email);

    if (result.success) {
      successMessage.value = result.data?.message || 'Si el email existe, se enviará un enlace de recuperación';
      isSuccess.value = true;
      
      // Redirigir al login después de 3 segundos
      setTimeout(() => {
        router.push({ name: 'Login' });
      }, 3000);
    } else {
      errorMessage.value = result.message || 'Error al solicitar recuperación de contraseña';
      isSuccess.value = false;
    }
  } catch (error) {
    errorMessage.value = 'Error de conexión. Intenta nuevamente.';
    isSuccess.value = false;
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.forgot-password-view {
  min-height: 100vh;
  background: #f5f7fa;
  padding: 16px;
}

.forgot-password-row {
  min-height: calc(100vh - 32px);
}

.forgot-password-card__header {
  background: linear-gradient(135deg, #3bd4ae 0%, #2a9d8f 100%);
  color: white;
}

.forgot-password-card__title {
  margin: 16px 0 8px;
  font-size: 2rem;
  color: white;
  font-weight: 700;
}

.forgot-password-card__subtitle {
  margin: 0;
  opacity: 0.95;
  color: white;
  font-size: 1rem;
}

@media (max-width: 960px) {
  .forgot-password-view {
    padding: 16px;
  }

  .forgot-password-row {
    min-height: calc(100vh - 32px);
  }
}
</style>

