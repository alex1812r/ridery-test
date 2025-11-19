import express from 'express';
import {
  listVehicles,
  createVehicle,
  updateVehicleStatus
} from '../controllers/vehicleController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Todas las rutas de vehículos requieren autenticación
router.use(authMiddleware);

// Ruta para listar vehículos (paginado y ordenado por fecha desc)
router.get('/', listVehicles);

// Ruta para crear un nuevo vehículo
router.post('/', createVehicle);

// Ruta para actualizar el estado de un vehículo
router.patch('/:id/status', updateVehicleStatus);

export default router;
