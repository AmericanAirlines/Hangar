import { Router } from 'express';
import { post } from './post';
import { mountUserMiddleware } from '../../middleware/mountUserMiddleware';
import { members } from './members';

export const project = Router();

project.post('', mountUserMiddleware, post);
project.use('/members', members);

