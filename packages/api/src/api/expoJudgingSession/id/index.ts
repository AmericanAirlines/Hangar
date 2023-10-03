import { Router } from 'express';
import { get } from './get';
import { projects } from './projects';

export const id = Router({ mergeParams: true });

id.get('', get);
id.use('/projects', projects);
