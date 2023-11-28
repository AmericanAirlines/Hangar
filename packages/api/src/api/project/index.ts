import { Router } from 'express';
import { post } from './post';
import { mountUserMiddleware } from '../../middleware/mountUserMiddleware';
import { contributors } from './contributors';
import { id } from './id';
import { get } from './get';

export const project = Router();

project.post('', mountUserMiddleware, post);
project.use('/contributors', mountUserMiddleware, contributors);
project.get('', get);

// this route must be registered last to prevent collisions
project.use('/:id', id);
