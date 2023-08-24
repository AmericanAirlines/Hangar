import { Router } from 'express';
import { post } from './post';
import { mountUserMiddleware } from '../../middleware/mountUserMiddleware';

export const project = Router();

project.post('', post);
