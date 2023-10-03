import { Router } from 'express';
import { judgeMiddleware } from '../../../../middleware/judgeMiddleware';
import { get } from './get';

export const projects = Router();

projects.get('', judgeMiddleware, get);
