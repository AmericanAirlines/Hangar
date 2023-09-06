import { z } from 'zod';

const judgingSession = z.object({
  inviteCode: z.string(),
});

export const post = z.object({
  sessionType: judgingSession,
});
