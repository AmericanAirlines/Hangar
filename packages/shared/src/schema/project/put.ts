import { z } from 'zod';
import { core } from './core';

export const put = core.merge(
  z.object({
    // Add respective properties.
  }),
);
