import { z } from 'zod';
import { commonSchema } from './common';

export const put = z.object({
  ...commonSchema.shape,
});
