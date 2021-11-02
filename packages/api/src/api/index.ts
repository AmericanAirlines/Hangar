/* istanbul ignore file */
import { Router } from 'express';
import { auth } from './auth';
import { events } from './events';
import { health } from './health';
import { users } from './users';
import { prizes } from './prizes';
import { subscription } from './subscription';

export const api = Router();

api.use('/health', health);
api.use('/users', users);
api.use('/auth', auth);
api.use('/event', events);
api.use('/prizes', prizes);
api.use('/subscription', subscription);
