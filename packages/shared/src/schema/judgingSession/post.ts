import { z } from 'zod';

// export const PostValidation = {
//   EXACT_INVITE_CODE_LENGTH: 36,
// };

export const post = z.object({
  inviteCode: z.string().uuid(),
});
