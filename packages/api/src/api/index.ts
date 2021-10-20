/* istanbul ignore file */
import { Router } from 'express';
import { auth } from './auth';
import { health } from './health';
import { users } from './users';
import { videos } from './videos';

export const api = Router();

api.use('/health', health);
api.use('/users', users);
api.use('/videos', videos);
api.use('/auth', auth);
