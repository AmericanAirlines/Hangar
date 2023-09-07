import { z } from 'zod';

export const PostValidation = {
  MIN_NAME_LENGTH: 5,
  MAX_NAME_LENGTH: 50,
  MIN_DESCRIPTION_LENGTH: 20,
  MAX_DESCRIPTION_LENGTH: 200,
  MAX_LOCATION_LENGTH: 100,
};

export const post = z.object({
  name: z.string().trim().min(PostValidation.MIN_NAME_LENGTH).max(PostValidation.MAX_NAME_LENGTH),
  description: z
    .string()
    .trim()
    .min(PostValidation.MIN_DESCRIPTION_LENGTH)
    .max(PostValidation.MAX_DESCRIPTION_LENGTH),
  location: z.string().trim().max(PostValidation.MAX_LOCATION_LENGTH).optional(),
});
