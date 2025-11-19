import * as vehicleService from '../services/vehicleService.js';

/**
 * Lista todos los vehículos con paginación y ordenados por fecha descendente
 * GET /api/vehicles?page=1&limit=10
 * Maneja la petición HTTP y delega la lógica de negocio al servicio
 */
export const listVehicles = async (req, res) => {
  try {
    // Extraer parámetros de paginación
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Llamar al servicio para obtener los vehículos
    const result = await vehicleService.listVehicles(page, limit);

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error al listar vehículos:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Error al obtener la lista de vehículos',
      error: error.message
    });
  }
};

/**
 * Crea un nuevo vehículo
 * POST /api/vehicles
 * Maneja la petición HTTP y delega la lógica de negocio al servicio
 */
export const createVehicle = async (req, res) => {
  try {
    const { mark, model, year, status } = req.body;
    const userId = req.userId; // Obtenido del authMiddleware

    // Llamar al servicio para crear el vehículo
    const vehicle = await vehicleService.createVehicle({ mark, model, year, status }, userId);

    res.status(201).json({
      success: true,
      message: 'Vehículo creado exitosamente',
      data: { vehicle }
    });
  } catch (error) {
    console.error('Error al crear vehículo:', error);

    // Manejar errores de validación de Mongoose
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Error de validación',
        errors
      });
    }

    // Determinar código de estado: 400 para errores de validación, 500 para otros
    const statusCode =
      error.message.includes('requerido') ||
      error.message.includes('inválido') ||
      error.message.includes('debe ser')
        ? 400
        : 500;

    res.status(statusCode).json({
      success: false,
      message: error.message || 'Error al crear el vehículo',
      error: error.message
    });
  }
};

/**
 * Actualiza el estado de un vehículo
 * PATCH /api/vehicles/:id/status
 * Maneja la petición HTTP y delega la lógica de negocio al servicio
 */
export const updateVehicleStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.userId; // Obtenido del authMiddleware

    // Llamar al servicio para actualizar el estado del vehículo
    const vehicle = await vehicleService.updateVehicleStatus(id, status, userId);

    res.status(200).json({
      success: true,
      message: 'Estado del vehículo actualizado exitosamente',
      data: { vehicle }
    });
  } catch (error) {
    console.error('Error al actualizar estado del vehículo:', error);

    // Manejar errores de validación de Mongoose
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Error de validación',
        errors
      });
    }

    // Manejar errores de cast (ID inválido)
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'ID de vehículo inválido'
      });
    }

    // Determinar código de estado según el tipo de error
    const statusCode =
      error.statusCode ||
      (error.message.includes('requerido') ||
      error.message.includes('inválido') ||
      error.message.includes('debe ser')
        ? 400
        : 500);

    res.status(statusCode).json({
      success: false,
      message: error.message || 'Error al actualizar el estado del vehículo',
      error: error.message
    });
  }
};
