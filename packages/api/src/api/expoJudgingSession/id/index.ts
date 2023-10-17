import { Router } from 'express';
import { get } from './get';
import { projects } from './projects';
import { skip } from './skip';
import { continueSession } from './continueSession';
import { results } from './results';
import { adminMiddleware } from '../../../middleware/adminMiddleware';
import { judgeMiddleware } from '../../../middleware/judgeMiddleware';

export const id = Router({ mergeParams: true });

id.use('/results', adminMiddleware, results);

// Judge routes
id.use(judgeMiddleware);
id.get('', get);
id.use('/projects', projects);
id.use('/skip', skip);
id.use('/continueSession', continueSession);
