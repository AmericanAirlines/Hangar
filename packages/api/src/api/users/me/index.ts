import { Router } from 'express';
import { validateSessionMountUser } from '../../../middleware/mountUserMiddleware';
import { returnUser } from './get';

export const me = Router();

me.get('/me', validateSessionMountUser, returnUser);
