import { z } from 'zod';

export const commonSchema = z.object({
  inviteCode: z.string().uuid(),
});
