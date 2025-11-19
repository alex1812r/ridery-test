import { defineStore } from 'pinia';
import api from '../api/axios.js';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token')
  }),

  getters: {
    isLoggedIn: state => state.isAuthenticated && !!state.token
  },

  actions: {
    async login(email, password) {
      try {
        const response = await api.post('/auth/login', {
          email,
          password
        });

        const { data } = response.data;
        this.setAuth(data.user, data.token);
        return { success: true, data };
      } catch (error) {
        return {
          success: false,
          message: error.response?.data?.message || 'Error al iniciar sesión'
        };
      }
    },

    async register(email, password) {
      try {
        const response = await api.post('/auth/register', {
          email,
          password
        });

        const { data } = response.data;
        this.setAuth(data.user, data.token);
        return { success: true, data };
      } catch (error) {
        return {
          success: false,
          message: error.response?.data?.message || 'Error al registrar usuario'
        };
      }
    },

    setAuth(user, token) {
      this.user = user;
      this.token = token;
      this.isAuthenticated = true;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    },

    logout() {
      this.user = null;
      this.token = null;
      this.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },

    async updateProfile(profileData) {
      try {
        const response = await api.put('/auth/profile', profileData);

        const { data } = response.data;
        // Actualizar el usuario en el store
        this.user = { ...this.user, ...data.user };
        localStorage.setItem('user', JSON.stringify(this.user));

        return { success: true, data };
      } catch (error) {
        return {
          success: false,
          message: error.response?.data?.message || 'Error al actualizar el perfil'
        };
      }
    },

    async changePassword(currentPassword, newPassword) {
      try {
        const response = await api.put('/auth/change-password', {
          currentPassword,
          newPassword
        });

        return { success: true, data: response.data };
      } catch (error) {
        return {
          success: false,
          message: error.response?.data?.message || 'Error al cambiar la contraseña'
        };
      }
    },

    async forgotPassword(email) {
      try {
        const response = await api.post('/auth/forgot-password', {
          email
        });

        return { success: true, data: response.data };
      } catch (error) {
        return {
          success: false,
          message: error.response?.data?.message || 'Error al solicitar recuperación de contraseña'
        };
      }
    },

    async recoveryPassword(token, newPassword) {
      try {
        const response = await api.post('/auth/recovery-password', {
          token,
          newPassword
        });

        return { success: true, data: response.data };
      } catch (error) {
        return {
          success: false,
          message: error.response?.data?.message || 'Error al restablecer la contraseña'
        };
      }
    }
  }
});

