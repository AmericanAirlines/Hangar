import { Router } from 'express';
import { put } from './put';
import { me } from './me';
import { mountUserMiddleware } from '../../middleware/mountUserMiddleware';

export const users = Router();

users.use(mountUserMiddleware);

users.put('', put);
users.use('/me', me);
