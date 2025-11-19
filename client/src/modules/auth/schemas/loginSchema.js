import { z } from 'zod';
import { toTypedSchema } from '@vee-validate/zod';

export const loginSchema = toTypedSchema(
  z.object({
    email: z
      .string()
      .min(1, 'El correo electrónico es requerido')
      .email('El correo electrónico debe ser válido'),
    password: z
      .string()
      .min(1, 'La contraseña es requerida')
      .min(6, 'La contraseña debe tener al menos 6 caracteres')
  })
);

