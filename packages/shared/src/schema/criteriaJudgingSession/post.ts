import { z } from 'zod';
import { criteria } from '../criteria';

export const PostValidation = {
  MIN_TITLE_LENGTH: 5,
  MAX_TITLE_LENGTH: 50,
  MIN_DESCRIPTION_LENGTH: 20,
  MAX_DESCRIPTION_LENGTH: 200,

  // Criteria
  MIN_CRITERIA: 1,
  MAX_CRITERIA: 7,
};

export const post = z.object({
  title: z.string().min(PostValidation.MIN_TITLE_LENGTH).max(PostValidation.MAX_TITLE_LENGTH),
  description: z
    .string()
    .min(PostValidation.MIN_DESCRIPTION_LENGTH)
    .max(PostValidation.MAX_DESCRIPTION_LENGTH),
  criteriaList: z.array(criteria).min(PostValidation.MIN_CRITERIA).max(PostValidation.MAX_CRITERIA),
  // TODO: Add special criteria to evaluate the total weight to make sure it's equal to 1
});
