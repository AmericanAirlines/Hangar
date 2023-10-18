import { Router } from 'express';
import { post } from './post';
import { mountUserMiddleware } from '../../middleware/mountUserMiddleware';
import { contributors } from './contributors';
import { details } from './id';

export const project = Router();

// project.get('', /* don't mount user */, get);
project.use(mountUserMiddleware);
project.post('', post);
project.use('/contributors', contributors);
project.use('/id', details);
