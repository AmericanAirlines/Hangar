import { z } from 'zod';

export const put = z.object({
  projectId: z.string().uuid(),
  inviteCode: z.string(),
});
