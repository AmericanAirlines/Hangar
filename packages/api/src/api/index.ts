/* istanbul ignore file */
import { Router } from 'express';
import { events } from './events';
import { health } from './health';
import { users } from './users';
import { prizes } from './prizes';
import { subscription } from './subscription';
import { appConfig } from './appConfig';
import { project } from './project';
import { projects } from './projects';
import { queue } from './queue';
import { onboarding } from './onboarding';
import { discord } from './discord';

export const api = Router();

api.use('/health', health);
api.use('/users', users);
api.use('/events', events);
api.use('/prizes', prizes);
api.use('/subscription', subscription);
api.use('/appConfig', appConfig);
api.use('/project', project);
api.use('/projects', projects);
api.use('/queue', queue);
api.use('/onboarding', onboarding);
api.use('/discord', discord);
