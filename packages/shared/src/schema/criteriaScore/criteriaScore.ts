import { z } from 'zod';

export const criteriaScore = z.object({
  criteria: z.string(),
  score: z.number().int().positive(),
});
