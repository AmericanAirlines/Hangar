import { Router } from 'express';
import { slack } from './slack';
import { callback } from './callback';

export const auth = Router();

auth.use('/callback', callback);
auth.get('/slack', slack);
