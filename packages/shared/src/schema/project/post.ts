import { z } from 'zod';
import { core } from './core';

export const post = core.merge(
  z.object({
    // Add respective properties.
  }),
);
