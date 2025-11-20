import { defineStore } from 'pinia';
import api from '../../../core/api/axios.js';

export const useVehicleStore = defineStore('vehicle', {
  state: () => ({
    vehicles: [],
    total: 0,
    loading: false,
    error: null
  }),

  actions: {
    async fetchVehicles(page = 1, limit = 10, sortBy = 'vehicleId', sortOrder = 'asc', filters = {}) {
      this.loading = true;
      this.error = null;

      try {
        const params = {
          page,
          limit,
          sortBy,
          sortOrder
        };

        // Agregar filtros solo si tienen valor
        if (filters.search && filters.search.trim()) {
          params.search = filters.search.trim();
        }
        if (filters.yearFrom) {
          params.yearFrom = filters.yearFrom;
        }
        if (filters.yearTo) {
          params.yearTo = filters.yearTo;
        }
        
        const response = await api.get('/vehicles', { params });

        // El backend devuelve: { success: true, data: { vehicles: [], pagination: { totalItems: ... } } }
        const result = response.data.data;
        this.vehicles = result.vehicles || [];
        this.total = result.pagination?.totalItems || 0;

        return { success: true, data: result.vehicles, total: this.total };
      } catch (error) {
        this.error = error.response?.data?.message || 'Error al cargar vehículos';
        return {
          success: false,
          message: this.error
        };
      } finally {
        this.loading = false;
      }
    },

    async createVehicle(vehicleData) {
      this.loading = true;
      this.error = null;

      try {
        const response = await api.post('/vehicles', vehicleData);
        return { success: true, data: response.data.data };
      } catch (error) {
        this.error = error.response?.data?.message || 'Error al crear vehículo';
        return {
          success: false,
          message: this.error
        };
      } finally {
        this.loading = false;
      }
    },

    async updateVehicleStatus(vehicleId, status) {
      this.loading = true;
      this.error = null;

      try {
        const response = await api.patch(`/vehicles/${vehicleId}/status`, { status });
        return { success: true, data: response.data.data };
      } catch (error) {
        this.error = error.response?.data?.message || 'Error al actualizar estado';
        return {
          success: false,
          message: this.error
        };
      } finally {
        this.loading = false;
      }
    },

    async updateVehicle(vehicleId, vehicleData) {
      this.loading = true;
      this.error = null;

      try {
        const response = await api.put(`/vehicles/${vehicleId}`, vehicleData);
        return { success: true, data: response.data.data };
      } catch (error) {
        this.error = error.response?.data?.message || 'Error al actualizar vehículo';
        return {
          success: false,
          message: this.error
        };
      } finally {
        this.loading = false;
      }
    },

    async deleteVehicle(vehicleId) {
      this.loading = true;
      this.error = null;

      try {
        const response = await api.delete(`/vehicles/${vehicleId}`);
        return { success: true, message: response.data.message };
      } catch (error) {
        this.error = error.response?.data?.message || 'Error al eliminar vehículo';
        return {
          success: false,
          message: this.error
        };
      } finally {
        this.loading = false;
      }
    }
  }
});

