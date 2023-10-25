import { z } from 'zod';

export const criteriaScore = z.object({
  criteria: z.string(),
  score: z
    .number()
    .or(z.string())
    .transform<number>((value, ctx) => {
      if (typeof value === 'number') return value;

      const int = Number.parseInt(value, 10);

      if (value.trim() === '' || Number.isNaN(int)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Must be an integer value',
        });
        return z.NEVER;
      }

      return int;
    }),
});
