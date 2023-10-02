import { z } from 'zod';
import { commonSchema } from './common';

export const post = commonSchema.merge(
  z.object({
    // Add respective properties.
  }),
);
