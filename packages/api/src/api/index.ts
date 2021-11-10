/* istanbul ignore file */
import { Router } from 'express';
import { events } from './events';
import { health } from './health';
import { users } from './users';
import { prizes } from './prizes';
import { subscription } from './subscription';
import { queue } from './queue';

export const api = Router();

api.use('/health', health);
api.use('/users', users);
api.use('/events', events);
api.use('/prizes', prizes);
api.use('/subscription', subscription);
api.use('/queue', queue);
