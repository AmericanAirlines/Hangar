import { Router } from 'express';
import { get } from './get';

export const pingfed = Router();

pingfed.get('', get);
