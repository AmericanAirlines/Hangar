import { Router } from 'express';
import { get } from './get';
import { judgeMiddleware } from '../../../middleware/judgeMiddleware';
import { projects } from './projects';
import { criteriaJudgingSessionMiddleware } from '../../../middleware/criteriaJudgingSessionMiddleware';

export const id = Router({ mergeParams: true });

// Judge routes
id.use(judgeMiddleware, criteriaJudgingSessionMiddleware);
id.get('', get);
id.get('/projects', projects);
