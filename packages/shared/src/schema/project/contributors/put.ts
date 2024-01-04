import { z } from 'zod';

export const put = z.object({
  inviteCode: z.string().uuid(),
});
