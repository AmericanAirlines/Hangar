import { z } from 'zod';

const judgingSession = z.object({
  inviteCode: z.string(),
});

export const put = z.object({
  sessionType: judgingSession,
});
