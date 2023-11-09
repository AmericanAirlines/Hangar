import { z } from 'zod';

export const PutValidation = {
  MIN_NAME_LENGTH: 5,
  MAX_NAME_LENGTH: 50,
  MIN_DESCRIPTION_LENGTH: 20,
  MAX_DESCRIPTION_LENGTH: 200,
  MAX_LOCATION_LENGTH: 100,
};

export const post = z.object({
  name: z.string().trim().min(PutValidation.MIN_NAME_LENGTH).max(PutValidation.MAX_NAME_LENGTH),
  description: z
    .string()
    .trim()
    .min(PutValidation.MIN_DESCRIPTION_LENGTH)
    .max(PutValidation.MAX_DESCRIPTION_LENGTH),
  location: z.string().trim().max(PutValidation.MAX_LOCATION_LENGTH).optional(),
  repoUrl: z
    .string()
    .trim()
    .url()
    .refine(
      (url) => url.startsWith('https://github.com/') || url.startsWith('https://gitlabs.com/'),
      'Not a supported repo hosting platform',
    ),
});
