import { Router } from 'express';
import { post } from './post';
import { mountUserMiddleware } from '../../middleware/mountUserMiddleware';
import { judgeMiddleware } from '../../middleware/judgeMiddleware';
import { put } from './put';

export const judge = Router();

judge.post('', mountUserMiddleware, post);
judge.put('', judgeMiddleware, put);
