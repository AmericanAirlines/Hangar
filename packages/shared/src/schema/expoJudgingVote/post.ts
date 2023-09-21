import z from 'zod';

export const post = z.object({
  currentProjectChosen: z.boolean(),
  expoJudgingSessionId: z.string().regex(/[0-9]/g),
});
