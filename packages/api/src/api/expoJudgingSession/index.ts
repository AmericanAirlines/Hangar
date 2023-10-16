import { Router } from 'express';
import { post } from './post';
import { get } from './get';
import { adminMiddleware } from '../../middleware/adminMiddleware';
import { id } from './id';

export const expoJudgingSession = Router();

// Self-managed auth
expoJudgingSession.use('/:id', id);

// admin auth required
expoJudgingSession.use(adminMiddleware);
expoJudgingSession.post('', post);
expoJudgingSession.get('', get);
