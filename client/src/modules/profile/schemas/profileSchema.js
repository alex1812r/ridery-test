import { z } from 'zod';
import { toTypedSchema } from '@vee-validate/zod';

export const profileSchema = toTypedSchema(
  z.object({
    email: z
      .string()
      .min(1, 'El email es requerido')
      .email('El email debe tener un formato válido')
  })
);

export const changePasswordSchema = toTypedSchema(
  z
    .object({
      currentPassword: z.string().min(1, 'La contraseña actual es requerida'),
      newPassword: z
        .string()
        .min(6, 'La contraseña debe tener al menos 6 caracteres'),
      confirmPassword: z.string().min(1, 'La confirmación de contraseña es requerida')
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: 'Las contraseñas no coinciden',
      path: ['confirmPassword']
    })
);

