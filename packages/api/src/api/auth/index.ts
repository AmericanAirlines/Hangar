import { Router } from 'express';
import { get } from './get';
import { callback } from './callback';

export const auth = Router();

auth.use('/callback', callback);
auth.get('/slack', get);
