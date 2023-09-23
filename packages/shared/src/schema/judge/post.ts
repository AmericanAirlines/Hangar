import { z } from 'zod';
import { commonSchema } from './common';

export const post = z.object({
  ...commonSchema.shape,
});
