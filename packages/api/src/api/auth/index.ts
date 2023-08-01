import { Router } from 'express';
import { slack } from './slack';

export const auth = Router();

auth.get('/slack', slack);
