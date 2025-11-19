import { z } from 'zod';
import { toTypedSchema } from '@vee-validate/zod';

export const vehicleSchema = toTypedSchema(
  z.object({
    mark: z
      .string()
      .min(1, 'La marca es requerida')
      .min(2, 'La marca debe tener al menos 2 caracteres'),
    model: z
      .string()
      .min(1, 'El modelo es requerido')
      .min(2, 'El modelo debe tener al menos 2 caracteres'),
    year: z
      .string()
      .min(1, 'El año es requerido')
      .regex(/^\d{4}$/, 'El año debe tener 4 dígitos')
      .refine(
        (year) => {
          const yearNum = parseInt(year);
          const currentYear = new Date().getFullYear();
          return yearNum >= 1900 && yearNum <= currentYear;
        },
        {
          message: 'El año debe estar entre 1900 y el año actual (no se permiten años futuros)'
        }
      ),
    status: z.enum(['available', 'maintenance', 'service'], {
      errorMap: () => ({ message: 'El estado debe ser válido' })
    })
  })
);

