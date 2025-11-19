import { z } from 'zod';
import { toTypedSchema } from '@vee-validate/zod';

export const forgotPasswordSchema = toTypedSchema(
  z.object({
    email: z
      .string()
      .min(1, 'El correo electrónico es requerido')
      .email('El correo electrónico debe ser válido')
  })
);

