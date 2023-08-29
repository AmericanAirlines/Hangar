import { Router } from 'express';
import { put } from './put';
import { me } from './me';
import { mountUserMiddleware } from '../../middleware/mountUserMiddleware';

export const user = Router();

user.use(mountUserMiddleware);

user.put('', put);
user.use('/me', me);
