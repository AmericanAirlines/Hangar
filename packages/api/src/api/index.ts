/* istanbul ignore file */
import { Router } from 'express';
import { auth } from './auth';
import { health } from './health';
import { users } from './users';
import { prizes } from './prizes';

export const api = Router();

api.use('/health', health);
api.use('/users', users);
api.use('/auth', auth);
api.use('/prizes', prizes);
