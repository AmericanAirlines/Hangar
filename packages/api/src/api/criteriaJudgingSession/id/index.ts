import { Router } from 'express';
import { get } from './get';
import { judgeMiddleware } from '../../../middleware/judgeMiddleware';

export const id = Router({ mergeParams: true });

// Judge routes
id.use(judgeMiddleware);
id.get('', get);
