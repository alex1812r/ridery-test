import { defineStore } from 'pinia';
import api from '../../../core/api/axios.js';

export const useVehicleMarkStore = defineStore('vehicleMark', {
  state: () => ({
    marks: [],
    marksWithModels: [],
    loading: false,
    error: null
  }),

  actions: {
    async fetchMarks() {
      this.loading = true;
      this.error = null;

      try {
        const response = await api.get('/vehicle-marks');
        this.marks = response.data.data.marks || [];
        return { success: true, data: this.marks };
      } catch (error) {
        this.error = error.response?.data?.message || 'Error al cargar marcas';
        return {
          success: false,
          message: this.error
        };
      } finally {
        this.loading = false;
      }
    },

    async fetchMarksWithModels() {
      this.loading = true;
      this.error = null;

      try {
        const response = await api.get('/vehicle-marks/with-models');
        this.marksWithModels = response.data.data.marks || [];
        return { success: true, data: this.marksWithModels };
      } catch (error) {
        this.error = error.response?.data?.message || 'Error al cargar marcas con modelos';
        return {
          success: false,
          message: this.error
        };
      } finally {
        this.loading = false;
      }
    },

    async fetchModelsByMark(markId) {
      this.loading = true;
      this.error = null;

      try {
        const response = await api.get(`/vehicle-marks/${markId}/models`);
        return { 
          success: true, 
          data: response.data.data.models || [] 
        };
      } catch (error) {
        this.error = error.response?.data?.message || 'Error al cargar modelos';
        return {
          success: false,
          message: this.error
        };
      } finally {
        this.loading = false;
      }
    }
  },

  getters: {
    // Obtener modelos de una marca específica desde el cache
    getModelsByMarkId: (state) => (markId) => {
      const markWithModels = state.marksWithModels.find(m => m._id === markId);
      return markWithModels?.models || [];
    }
  }
});

