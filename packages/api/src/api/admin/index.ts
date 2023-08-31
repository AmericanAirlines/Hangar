import { Router } from 'express';
import { me } from './me';
import { adminMiddleware } from '../../middleware/adminMiddleware';

export const user = Router();

user.use(adminMiddleware);

user.use('/me', me);
