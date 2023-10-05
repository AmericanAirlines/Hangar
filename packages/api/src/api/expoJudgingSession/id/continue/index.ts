import { Router } from 'express';
import { get } from './get';

export const Continue = Router();

Continue.get('', get);
