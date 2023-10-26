import { Router } from 'express';
import { get } from './get';
import { judgeMiddleware } from '../../../middleware/judgeMiddleware';
import { projects } from './projects';
import { criteriaJudgingSessionMiddleware } from '../../../middleware/criteriaJudgingSessionMiddleware';
import { results } from './results';
import { adminMiddleware } from '../../../middleware/adminMiddleware';

export const id = Router({ mergeParams: true });

id.use('/results', adminMiddleware, results);

// Judge routes
id.use(judgeMiddleware, criteriaJudgingSessionMiddleware);
id.get('', get);
id.use('/projects', projects);
