import { Router } from 'express';
import { post } from './post';
import { sessionMiddleware } from '../../middleware/sessionMiddleware';

export const users = Router();

users.post('', sessionMiddleware, post);
