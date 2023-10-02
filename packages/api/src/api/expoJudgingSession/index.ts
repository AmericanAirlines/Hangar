import { Router } from 'express';
import { post } from './post';
import { get } from './get';
import { adminMiddleware } from '../../middleware/adminMiddleware';
import { judgeMiddleware } from '../../middleware/judgeMiddleware';
import { id } from './id';

export const expoJudgingSession = Router();

expoJudgingSession.post('', adminMiddleware, post);
expoJudgingSession.get('', adminMiddleware, get);
expoJudgingSession.use('/:id', judgeMiddleware, id);
