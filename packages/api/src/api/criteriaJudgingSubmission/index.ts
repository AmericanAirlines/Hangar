import { Router } from 'express';
import { post } from './post';
import { judgeMiddleware } from '../../middleware/judgeMiddleware';

export const criteriaJudgingSubmission = Router();

criteriaJudgingSubmission.use(judgeMiddleware);
criteriaJudgingSubmission.post('', post);
