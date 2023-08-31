import { Router } from 'express';
import { me } from './me';
import { adminMiddleware } from '../../middleware/adminMiddleware';

export const admin = Router();

admin.use(adminMiddleware);

admin.use('/me', me);
