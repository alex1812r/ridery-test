<template>
  <DashboardLayout>
    <v-row>
      <v-col cols="12" md="8" offset-md="2">
        <v-card>
          <v-card-title class="text-h5 font-weight-bold pa-6">
            <v-icon class="mr-3" color="primary">mdi-account-circle</v-icon>
            Mi Perfil
          </v-card-title>

          <v-divider></v-divider>

          <v-card-text class="pa-6">
            <!-- Información del Usuario -->
            <div class="mb-8">
              <h3 class="text-h6 mb-4">Información Personal</h3>
              <Form
                @submit="onSubmitProfile"
                :validation-schema="profileSchema"
                :initial-values="{ email: authStore.user?.email || '' }"
                v-slot="{ errors: formErrors }"
              >
                <Field name="email" v-slot="{ value, handleChange, handleBlur, errorMessage }">
                  <v-text-field
                    :model-value="value"
                    @update:model-value="handleChange"
                    @blur="handleBlur"
                    label="Email"
                    prepend-inner-icon="mdi-email"
                    variant="outlined"
                    color="primary"
                    :error-messages="errorMessage"
                    class="mb-4"
                    density="comfortable"
                    :disabled="profileLoading"
                  />
                </Field>

                <v-alert
                  v-if="profileError"
                  type="error"
                  variant="tonal"
                  class="mb-4"
                  closable
                  @click:close="profileError = ''"
                >
                  {{ profileError }}
                </v-alert>

                <v-alert
                  v-if="profileSuccess"
                  type="success"
                  variant="tonal"
                  class="mb-4"
                  closable
                  @click:close="profileSuccess = ''"
                >
                  {{ profileSuccess }}
                </v-alert>

                <div class="d-flex justify-end">
                  <v-btn
                    type="submit"
                    variant="flat"
                    color="primary"
                    :loading="profileLoading"
                    :disabled="profileLoading"
                  >
                    Guardar Cambios
                  </v-btn>
                </div>
              </Form>
            </div>

            <v-divider class="my-8"></v-divider>

            <!-- Cambiar Contraseña -->
            <div>
              <h3 class="text-h6 mb-4">Cambiar Contraseña</h3>
              <Form
                @submit="onSubmitPassword"
                :validation-schema="changePasswordSchema"
                v-slot="{ errors: formErrors }"
              >
                <Field name="currentPassword" v-slot="{ value, handleChange, handleBlur, errorMessage }">
                  <v-text-field
                    :model-value="value"
                    @update:model-value="handleChange"
                    @blur="handleBlur"
                    label="Contraseña Actual"
                    type="password"
                    prepend-inner-icon="mdi-lock"
                    variant="outlined"
                    color="primary"
                    :error-messages="errorMessage"
                    class="mb-4"
                    density="comfortable"
                    :disabled="passwordLoading"
                  />
                </Field>

                <Field name="newPassword" v-slot="{ value, handleChange, handleBlur, errorMessage }">
                  <v-text-field
                    :model-value="value"
                    @update:model-value="handleChange"
                    @blur="handleBlur"
                    label="Nueva Contraseña"
                    type="password"
                    prepend-inner-icon="mdi-lock-outline"
                    variant="outlined"
                    color="primary"
                    :error-messages="errorMessage"
                    class="mb-4"
                    density="comfortable"
                    :disabled="passwordLoading"
                  />
                </Field>

                <Field name="confirmPassword" v-slot="{ value, handleChange, handleBlur, errorMessage }">
                  <v-text-field
                    :model-value="value"
                    @update:model-value="handleChange"
                    @blur="handleBlur"
                    label="Confirmar Nueva Contraseña"
                    type="password"
                    prepend-inner-icon="mdi-lock-check"
                    variant="outlined"
                    color="primary"
                    :error-messages="errorMessage"
                    class="mb-4"
                    density="comfortable"
                    :disabled="passwordLoading"
                  />
                </Field>

                <v-alert
                  v-if="passwordError"
                  type="error"
                  variant="tonal"
                  class="mb-4"
                  closable
                  @click:close="passwordError = ''"
                >
                  {{ passwordError }}
                </v-alert>

                <v-alert
                  v-if="passwordSuccess"
                  type="success"
                  variant="tonal"
                  class="mb-4"
                  closable
                  @click:close="passwordSuccess = ''"
                >
                  {{ passwordSuccess }}
                </v-alert>

                <div class="d-flex justify-end">
                  <v-btn
                    type="submit"
                    variant="flat"
                    color="primary"
                    :loading="passwordLoading"
                    :disabled="passwordLoading"
                  >
                    Cambiar Contraseña
                  </v-btn>
                </div>
              </Form>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </DashboardLayout>
</template>

<script setup>
import { ref } from 'vue';
import { Form, Field } from 'vee-validate';
import { useAuthStore } from '../../../core/stores/authStore.js';
import { profileSchema, changePasswordSchema } from '../schemas/profileSchema.js';
import DashboardLayout from '../../../components/DashboardLayout.vue';

const authStore = useAuthStore();

const profileLoading = ref(false);
const profileError = ref('');
const profileSuccess = ref('');
const passwordLoading = ref(false);
const passwordError = ref('');
const passwordSuccess = ref('');

const onSubmitProfile = async (values) => {
  profileError.value = '';
  profileSuccess.value = '';
  profileLoading.value = true;

  try {
    const result = await authStore.updateProfile(values);
    if (result.success) {
      profileSuccess.value = 'Perfil actualizado exitosamente';
    } else {
      profileError.value = result.message || 'Error al actualizar el perfil';
    }
  } catch (error) {
    profileError.value = 'Error al actualizar el perfil';
  } finally {
    profileLoading.value = false;
  }
};

const onSubmitPassword = async (values) => {
  passwordError.value = '';
  passwordSuccess.value = '';
  passwordLoading.value = true;

  try {
    const result = await authStore.changePassword(
      values.currentPassword,
      values.newPassword
    );
    if (result.success) {
      passwordSuccess.value = 'Contraseña actualizada exitosamente';
      // Limpiar el formulario después de un tiempo
      setTimeout(() => {
        passwordSuccess.value = '';
      }, 3000);
    } else {
      passwordError.value = result.message || 'Error al cambiar la contraseña';
    }
  } catch (error) {
    passwordError.value = 'Error al cambiar la contraseña';
  } finally {
    passwordLoading.value = false;
  }
};
</script>

<style scoped>
/* Estilos específicos si son necesarios */
</style>

