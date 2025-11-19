import { z } from 'zod';
import { toTypedSchema } from '@vee-validate/zod';

export const recoveryPasswordSchema = toTypedSchema(
  z
    .object({
      token: z.string().min(1, 'El token es requerido'),
      newPassword: z
        .string()
        .min(1, 'La contraseña es requerida')
        .min(6, 'La contraseña debe tener al menos 6 caracteres'),
      confirmPassword: z.string().min(1, 'La confirmación de contraseña es requerida')
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: 'Las contraseñas no coinciden',
      path: ['confirmPassword']
    })
);

