<template>
  <v-container fluid class="login-view">
    <v-row class="fill-height login-row" align="center" justify="center">
      <v-col cols="12" sm="8" md="5" lg="4">
        <v-card class="elevation-12" rounded="xl">
          <v-card-item class="login-card__header">
            <div class="text-center pa-6">
              <v-icon color="white" size="72">mdi-car-sports</v-icon>
              <h1 class="login-card__title">Ridery</h1>
              <p class="login-card__subtitle">Inicia sesión para continuar</p>
            </div>
          </v-card-item>

          <v-card-text class="pa-8">
            <Form @submit="onSubmit" :validation-schema="loginSchema" v-slot="{ errors: formErrors }">
              <Field name="email" v-slot="{ field, errorMessage }">
                <v-text-field
                  v-bind="field"
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

              <Field name="password" v-slot="{ field, errorMessage }">
                <v-text-field
                  v-bind="field"
                  label="Contraseña"
                  :type="showPassword ? 'text' : 'password'"
                  prepend-inner-icon="mdi-lock-outline"
                  :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  variant="outlined"
                  color="primary"
                  :error-messages="errorMessage"
                  autocomplete="current-password"
                  class="mb-2"
                  density="comfortable"
                  @click:append-inner="showPassword = !showPassword"
                />
              </Field>

              <div class="text-right mb-4">
                <v-btn variant="text" color="primary" size="small" :to="{ name: 'ForgotPassword' }">
                  ¿Olvidaste tu contraseña?
                </v-btn>
              </div>

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

              <v-btn
                type="submit"
                color="primary"
                size="large"
                block
                :loading="loading"
                :disabled="loading"
              >
                <v-icon start>mdi-login</v-icon>
                Iniciar Sesión
              </v-btn>
            </Form>
          </v-card-text>

          <v-card-actions class="justify-center pa-6">
            <span class="text-body-2 mr-2">¿No tienes cuenta?</span>
            <v-btn variant="text" color="primary" :to="{ name: 'Register' }">
              Regístrate
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
import { loginSchema } from '../schemas/loginSchema.js';

const router = useRouter();
const authStore = useAuthStore();

const showPassword = ref(false);
const loading = ref(false);
const errorMessage = ref('');

const onSubmit = async (values) => {
  errorMessage.value = '';
  loading.value = true;

  try {
    const result = await authStore.login(values.email, values.password);
    if (result.success) {
      router.push({ name: 'Dashboard' });
    } else {
      errorMessage.value = result.message || 'Error al iniciar sesión';
    }
  } catch (error) {
    errorMessage.value = 'Error de conexión. Intenta nuevamente.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-view {
  min-height: 100vh;
  background: #f5f7fa;
  padding: 16px;
}

.login-row {
  min-height: calc(100vh - 32px);
}

.login-card__header {
  background: linear-gradient(135deg, #3bd4ae 0%, #2a9d8f 100%);
  color: white;
}

.login-card__title {
  margin: 16px 0 8px;
  font-size: 2rem;
  color: white;
  font-weight: 700;
}

.login-card__subtitle {
  margin: 0;
  opacity: 0.95;
  color: white;
  font-size: 1rem;
}

/* Asegurar centrado vertical en móviles y tablets */
@media (max-width: 960px) {
  .login-view {
    padding: 16px;
  }

  .login-row {
    min-height: calc(100vh - 32px);
  }
}
</style>
