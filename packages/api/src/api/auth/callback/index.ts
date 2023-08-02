import { Router } from 'express';
import { get } from './get';

export const callback = Router();

callback.get('/get', get);
