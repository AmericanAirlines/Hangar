import { Router } from 'express';
import { get } from './get';

export const prize = Router();

prize.get('', get);
