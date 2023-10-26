import { Router } from 'express';
import { get } from './get';

export const results = Router();

results.use('', get);
