import z from 'zod';

export const post = z.object({
  projectIds: z.array(z.string()).min(1),
});
