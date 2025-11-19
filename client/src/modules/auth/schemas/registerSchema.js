import { z } from 'zod';
import { toTypedSchema } from '@vee-validate/zod';

// Validaciones personalizadas para la contraseña (alineado con backend: mínimo 6 caracteres)
const passwordValidation = z
  .string()
  .min(1, 'La contraseña es requerida')
  .min(6, 'La contraseña debe tener al menos 6 caracteres');

export const registerSchema = toTypedSchema(
  z
    .object({
      email: z
        .string()
        .min(1, 'El correo electrónico es requerido')
        .email('El correo electrónico debe ser válido'),
      password: passwordValidation,
      confirmPassword: z
        .string()
        .min(1, 'Por favor confirma tu contraseña')
    })
    .refine(data => data.password === data.confirmPassword, {
      message: 'Las contraseñas no coinciden',
      path: ['confirmPassword']
    })
);

