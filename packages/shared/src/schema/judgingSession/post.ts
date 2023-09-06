import { z } from 'zod';

const judgingSession = z.object({
  inviteCode: z.string(),
  createdBy: z.object({
    // What should this look like? It's a Ref<User> in database/src/entities/JudgingSession.ts
  }),
});

export const put = z.object({
  sessionType: judgingSession,
});
