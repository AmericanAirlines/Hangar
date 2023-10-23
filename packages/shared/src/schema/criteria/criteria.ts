import { z } from 'zod';

const Validation = {
  TITLE_MIN_LENGTH: 5,
  TITLE_MAX_LENGTH: 30,
  DESCRIPTION_MIN_LENGTH: 0,
  DESCRIPTION_MAX_LENGTH: 100,
  WEIGHT_MIN: 0,
  WEIGHT_MAX: 1,
  SCALE_MIN: 0,
  SCALE_MAX: 7,
  SCALE_DESCRIPTION_MAX_LENGTH: 500,
};

export const criteria = z.object({
  title: z.string().min(Validation.TITLE_MIN_LENGTH).max(Validation.TITLE_MAX_LENGTH),
  description: z.string().min(Validation.DESCRIPTION_MIN_LENGTH).max(Validation.TITLE_MAX_LENGTH),
  weight: z.number().min(Validation.WEIGHT_MIN).max(Validation.WEIGHT_MAX),
  scaleMin: z.number().int().min(Validation.SCALE_MIN).max(Validation.SCALE_MAX),
  scaleMax: z.number().int().min(Validation.SCALE_MIN).max(Validation.SCALE_MAX),
  scaleDescription: z
    .string()
    .min(Validation.DESCRIPTION_MIN_LENGTH)
    .max(Validation.SCALE_DESCRIPTION_MAX_LENGTH),
});
