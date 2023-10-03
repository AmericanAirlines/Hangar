import { Router } from 'express';
import { judgeMiddleware } from '../../../../middleware/judgeMiddleware';
import { get } from './get';

export const teams = Router();

teams.get('', judgeMiddleware, get);
