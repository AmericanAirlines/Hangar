import { Router } from 'express';
import { post } from './post';
import { judgeMiddleware } from '../../middleware/judgeMiddleware';

export const expoJudgingVote = Router();

expoJudgingVote.post('', judgeMiddleware, post);
