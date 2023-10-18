import { Router } from 'express';
import { get } from './get';

export const details = Router({ mergeParams: true });

details.get('', get);
