import { Router } from 'express';
import { post } from './post';
import { sessionMiddleware } from '../../middleware/sessionMiddleware';
import { me } from './me';
import { validateSessionMountUser } from '../../middleware/mountUserMiddleware';

export const users = Router();

users.post('', sessionMiddleware, post);
users.use('/me', validateSessionMountUser, me);
