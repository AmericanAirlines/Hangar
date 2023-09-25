import { z } from 'zod';
import { commonSchema } from './common';

export const put = commonSchema.merge(
  z.object({
    // Add respective properties.
  }),
);
