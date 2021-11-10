/* istanbul ignore file */
import { Router } from 'express';
import { events } from './events';
import { health } from './health';
import { users } from './users';
import { prizes } from './prizes';
import { subscription } from './subscription';
import { onboarding } from './onboarding';

export const api = Router();

api.use('/health', health);
api.use('/users', users);
api.use('/events', events);
api.use('/prizes', prizes);
api.use('/subscription', subscription);
api.use('/onboarding', onboarding);
