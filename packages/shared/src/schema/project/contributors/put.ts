import { z } from 'zod';

export const put = z.object({
  projectId: z.string(),
  inviteCode: z.string().uuid(),
});
