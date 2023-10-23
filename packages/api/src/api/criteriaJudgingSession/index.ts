import { Router } from 'express';
import { post } from './post';
import { adminMiddleware } from '../../middleware/adminMiddleware';
import { get } from './get';
import { id } from './id';

export const criteriaJudgingSession = Router();

criteriaJudgingSession.use('/:id', id);
criteriaJudgingSession.post('', adminMiddleware, post);
criteriaJudgingSession.get('', adminMiddleware, get);
