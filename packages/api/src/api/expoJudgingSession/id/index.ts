import { Router } from 'express';
import { get } from './get';
import { projects } from './projects';
import { skip } from './skip';
import { continueSession } from './continueSession';

export const id = Router({ mergeParams: true });

id.get('', get);
id.use('/projects', projects);
id.use('/skip', skip);
id.use('/continueSession', continueSession);
