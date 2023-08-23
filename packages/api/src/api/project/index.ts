import { Router } from 'express';
import { post } from './post';
import { mountUserMiddleware } from '../../middleware/mountUserMiddleware';

export const users = Router();

users.post('', mountUserMiddleware, post);
