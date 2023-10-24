import { z } from 'zod';
import { criteriaScore } from '../criteriaScore';

export const post = z.object({
  criteriaJudgingSession: z.string(),
  project: z.string(),
  scores: z.array(criteriaScore),
});
