import { z } from 'zod';

export const post = z.object({
  inviteCode: z.string().uuid(),
});
