import { Router } from 'express';
import { get } from './get';

export const event = Router();

event.get('', get);
