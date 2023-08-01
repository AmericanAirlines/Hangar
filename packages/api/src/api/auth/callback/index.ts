import { Router } from 'express';
import { slack } from './slack';

export const callback = Router();

callback.get('/slack', slack);
