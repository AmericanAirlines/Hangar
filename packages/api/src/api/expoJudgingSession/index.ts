import { Router } from 'express';
import { post } from './post';
import { get } from './get';
import { adminMiddleware } from '../../middleware/adminMiddleware';

export const expoJudgingSession = Router();

expoJudgingSession.post('', adminMiddleware, post);
expoJudgingSession.get('', adminMiddleware, get);
