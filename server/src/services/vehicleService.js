import mongoose from 'mongoose';
import Vehicle from '../models/Vehicle.js';

/**
 * Lista vehículos con paginación y ordenados por fecha descendente
 * @param {number} page - Número de página
 * @param {number} limit - Cantidad de elementos por página
 * @returns {Promise<{vehicles: Array, pagination: Object}>} Lista de vehículos e información de paginación
 * @throws {Error} Si los parámetros de paginación son inválidos
 */
export const listVehicles = async (page, limit) => {
  // Validar parámetros de paginación
  if (page < 1 || limit < 1) {
    throw new Error('Los parámetros page y limit deben ser números positivos');
  }

  const skip = (page - 1) * limit;

  // Obtener vehículos con paginación, ordenados por fecha descendente
  const vehicles = await Vehicle.find()
    .populate('createdBy', 'email')
    .populate('updatedBy', 'email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  // Contar total de vehículos
  const total = await Vehicle.countDocuments();

  // Calcular información de paginación
  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return {
    vehicles,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems: total,
      itemsPerPage: limit,
      hasNextPage,
      hasPrevPage
    }
  };
};

/**
 * Valida los datos de un vehículo antes de crearlo
 * @param {Object} vehicleData - Datos del vehículo
 * @throws {Error} Si los datos son inválidos
 */
const validateVehicleData = vehicleData => {
  const { mark, model, year, status } = vehicleData;

  // Validar campos requeridos
  if (!mark || !model || !year) {
    throw new Error('Los campos mark, model y year son requeridos');
  }

  // Validar que mark y model sean strings no vacíos
  if (typeof mark !== 'string' || mark.trim().length === 0) {
    throw new Error('El campo mark debe ser un texto válido');
  }

  if (typeof model !== 'string' || model.trim().length === 0) {
    throw new Error('El campo model debe ser un texto válido');
  }

  // Validar que year sea un número válido
  if (typeof year !== 'number' || isNaN(year)) {
    throw new Error('El campo year debe ser un número válido');
  }

  // Validar rango del año
  const currentYear = new Date().getFullYear();
  if (year < 1900 || year > currentYear + 1) {
    throw new Error(`El año debe estar entre 1900 y ${currentYear + 1}`);
  }

  // Validar status si se proporciona
  const validStatuses = ['available', 'maintenance', 'service'];
  if (status && !validStatuses.includes(status)) {
    throw new Error(`El status debe ser uno de: ${validStatuses.join(', ')}`);
  }
};

/**
 * Crea un nuevo vehículo
 * @param {Object} vehicleData - Datos del vehículo (mark, model, year, status)
 * @param {string} userId - ID del usuario que crea el vehículo
 * @returns {Promise<Object>} Vehículo creado
 * @throws {Error} Si los datos son inválidos o hay errores de validación de Mongoose
 */
export const createVehicle = async (vehicleData, userId) => {
  // Validar datos del vehículo
  validateVehicleData(vehicleData);

  const { mark, model, year, status } = vehicleData;

  // Crear el vehículo
  const vehicle = await Vehicle.create({
    mark: mark.trim(),
    model: model.trim(),
    year,
    status: status || 'available',
    createdBy: userId,
    updatedBy: userId
  });

  // Poblar referencias para la respuesta
  await vehicle.populate('createdBy', 'email');
  await vehicle.populate('updatedBy', 'email');

  return vehicle;
};

/**
 * Valida el status de un vehículo
 * @param {string} status - Status a validar
 * @throws {Error} Si el status es inválido
 */
const validateStatus = status => {
  if (!status) {
    throw new Error('El campo status es requerido');
  }

  const validStatuses = ['available', 'maintenance', 'service'];
  if (!validStatuses.includes(status)) {
    throw new Error(`El status debe ser uno de: ${validStatuses.join(', ')}`);
  }
};

/**
 * Actualiza el estado de un vehículo
 * @param {string} vehicleId - ID del vehículo
 * @param {string} status - Nuevo estado del vehículo
 * @param {string} userId - ID del usuario que actualiza el vehículo
 * @returns {Promise<Object>} Vehículo actualizado
 * @throws {Error} Si el vehículo no existe, el ID es inválido o el status es inválido
 */
export const updateVehicleStatus = async (vehicleId, status, userId) => {
  // Validar status
  validateStatus(status);

  // Validar que el ID sea un ObjectId válido
  if (!mongoose.Types.ObjectId.isValid(vehicleId)) {
    throw new Error('ID de vehículo inválido');
  }

  // Buscar y actualizar el vehículo
  const vehicle = await Vehicle.findByIdAndUpdate(
    vehicleId,
    {
      status,
      updatedBy: userId
    },
    {
      new: true, // Retornar el documento actualizado
      runValidators: true // Ejecutar validaciones del schema
    }
  )
    .populate('createdBy', 'email')
    .populate('updatedBy', 'email');

  // Verificar si el vehículo existe
  if (!vehicle) {
    const error = new Error('Vehículo no encontrado');
    error.statusCode = 404;
    throw error;
  }

  return vehicle;
};
