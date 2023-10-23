import { Router } from 'express';
import { post } from './post';
import { adminMiddleware } from '../../middleware/adminMiddleware';
import { get } from './get';

export const criteriaJudgingSession = Router();

criteriaJudgingSession.post('', adminMiddleware, post);
criteriaJudgingSession.get('', adminMiddleware, get);
