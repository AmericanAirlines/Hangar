import { Router } from 'express';
// import { put } from './put';
import { me } from './me';
import { adminMiddleware } from '../../middleware/adminMiddleware';

export const user = Router();

user.use(adminMiddleware);

user.use('/me', me);
