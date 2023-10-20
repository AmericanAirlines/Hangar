import { Router } from 'express';
import { post } from './post';
import { adminMiddleware } from '../../middleware/adminMiddleware';

export const criteriaJudgingSession = Router();

criteriaJudgingSession.post('', adminMiddleware, post);
