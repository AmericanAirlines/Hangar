import { z } from 'zod';

const nameSchema = z.string().min(2).max(50);

export const put = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
});
