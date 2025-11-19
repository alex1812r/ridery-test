<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      :rail="isTablet ? true : rail"
      :permanent="!isMobile"
      :temporary="isMobile"
      :overlay="isMobile"
      class="dashboard-sidebar"
    >
      <v-list-item
        prepend-icon="mdi-car-sports"
        :title="(isTablet || rail) && !isMobile ? '' : 'Ridery'"
        nav
        class="sidebar-header"
        :class="{ 'sidebar-header--collapsed': (isTablet || rail) && !isMobile }"
        @click="!isTablet && !isMobile && rail ? (rail = false) : null"
      >
        <template v-slot:append v-if="!rail && !isTablet && !isMobile">
          <v-btn
            variant="text"
            icon="mdi-chevron-left"
            @click.stop="rail = !rail"
          ></v-btn>
        </template>
        <template v-slot:prepend v-if="(isTablet || rail) && !isMobile">
          <v-btn
            v-if="!isTablet"
            variant="text"
            icon="mdi-chevron-right"
            @click.stop="rail = false"
            class="expand-button"
          ></v-btn>
        </template>
      </v-list-item>

      <v-divider></v-divider>

      <v-list density="compact" nav>
        <v-list-item
          prepend-icon="mdi-view-dashboard"
          title="Dashboard"
          value="dashboard"
          :to="{ name: 'Dashboard' }"
        ></v-list-item>

        <v-list-item
          prepend-icon="mdi-car-multiple"
          title="Vehículos"
          value="vehicles"
          :to="{ name: 'Vehicles' }"
        ></v-list-item>

        <v-list-item
          prepend-icon="mdi-account"
          title="Perfil"
          value="profile"
          :to="{ name: 'Profile' }"
        ></v-list-item>
      </v-list>

      <template v-slot:append>
        <div class="pa-2">
          <v-btn
            v-if="!rail && !isTablet && !isMobile"
            block
            color="primary"
            variant="outlined"
            prepend-icon="mdi-logout"
            @click="handleLogout"
          >
            Cerrar Sesión
          </v-btn>
          <v-btn
            v-else
            icon="mdi-logout"
            color="primary"
            variant="text"
            @click="handleLogout"
          ></v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <v-app-bar
      :elevation="2"
      color="white"
      class="dashboard-topbar"
    >
      <v-app-bar-nav-icon
        v-if="isMobile"
        variant="text"
        @click.stop="drawer = !drawer"
      ></v-app-bar-nav-icon>
      <v-app-bar-nav-icon
        v-else-if="isTablet"
        variant="text"
        @click.stop="drawer = !drawer"
      ></v-app-bar-nav-icon>

      <v-spacer></v-spacer>

      <!-- <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn
            icon
            v-bind="props"
            class="mr-2"
          >
            <v-icon>mdi-bell-outline</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item title="No hay notificaciones"></v-list-item>
        </v-list>
      </v-menu> -->

      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn
            variant="text"
            v-bind="props"
            prepend-icon="mdi-account-circle"
          >
            {{ userEmail }}
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            prepend-icon="mdi-account"
            title="Mi Perfil"
            :to="{ name: 'Profile' }"
          ></v-list-item>
          <v-divider></v-divider>
          <v-list-item
            prepend-icon="mdi-logout"
            title="Cerrar Sesión"
            @click="handleLogout"
          ></v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-main class="dashboard-main">
      <v-container fluid class="pa-6">
        <slot></slot>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useDisplay } from 'vuetify';
import { useAuthStore } from '../core/stores/authStore.js';

const router = useRouter();
const authStore = useAuthStore();
const display = useDisplay();

const drawer = ref(true);
const rail = ref(false);

// Computed para detectar dispositivos
const isMobile = computed(() => display.mobile?.value ?? false);
const isTablet = computed(() => (display.tablet?.value ?? false) && !(display.mobile?.value ?? false));

// Ajustar drawer inicial según dispositivo
onMounted(() => {
  if (isMobile.value) {
    drawer.value = false; // Cerrado por defecto en mobile (fixed/overlay)
  } else {
    drawer.value = true; // Abierto en tablet (permanent minimizado) y desktop
  }
});

// Cerrar drawer en mobile cuando cambia de ruta
router.afterEach(() => {
  if (isMobile.value) {
    drawer.value = false;
  }
});

const userEmail = computed(() => {
  return authStore.user?.email || 'Usuario';
});

const handleLogout = () => {
  authStore.logout();
  router.push({ name: 'Login' });
};
</script>

<style scoped>
.dashboard-sidebar {
  border-right: 1px solid rgba(0, 0, 0, 0.12);
}

.sidebar-header {
  background: linear-gradient(135deg, #3bd4ae 0%, #2a9d8f 100%);
  color: white;
  min-height: 64px;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 0 !important;
}

.sidebar-header :deep(.v-list-item) {
  border-radius: 0 !important;
  padding: 12px 16px !important;
  min-height: 64px;
}

.sidebar-header--collapsed {
  cursor: pointer;
}

.sidebar-header--collapsed:hover {
  background: linear-gradient(135deg, #4ae4be 0%, #3bad9f 100%);
}

.sidebar-header :deep(.v-list-item-title) {
  color: white;
  font-weight: 700;
  font-size: 1.25rem;
  line-height: 1.5;
  overflow: visible;
  white-space: nowrap;
}

.sidebar-header :deep(.v-list-item__prepend) {
  width: 100%;
  justify-content: center;
}

.expand-button {
  color: white !important;
}

.dashboard-topbar {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}

.dashboard-main {
  background-color: #f5f7fa;
  min-height: 100vh;
}

/* Estilos para mobile */
@media (max-width: 960px) {
  .dashboard-sidebar {
    z-index: 1000;
  }
}
</style>

