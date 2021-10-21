/* istanbul ignore file */
import { Router } from 'express';
import { auth } from './auth';
import { health } from './health';
import { users } from './users';

export const api = Router();

api.use('/health', health);
api.use('/users', users);
api.use('/auth', auth);
