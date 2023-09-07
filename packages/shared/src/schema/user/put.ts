import { z } from 'zod';

export const PutValidation = {
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 50,
};

const nameSchema = z
  .string()
  .trim()
  .min(PutValidation.MIN_NAME_LENGTH)
  .max(PutValidation.MAX_NAME_LENGTH);

export const put = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
});
