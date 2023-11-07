import { Router } from 'express';
import { get } from './get';

export const results = Router({ mergeParams: true });

results.use('', get);
