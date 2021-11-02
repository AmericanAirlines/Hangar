/* istanbul ignore file */
import { Router } from 'express';
import { events } from './events';
import { health } from './health';
import { users } from './users';
import { prizes } from './prizes';

export const api = Router();

api.use('/health', health);
api.use('/users', users);
api.use('/event', events);
api.use('/prizes', prizes);
