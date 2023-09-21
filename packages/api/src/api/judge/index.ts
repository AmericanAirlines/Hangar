import { Router } from 'express';
import { post } from './post';
import { mountUserMiddleware } from '../../middleware/mountUserMiddleware';

export const judge = Router();

judge.post('', mountUserMiddleware, post);
