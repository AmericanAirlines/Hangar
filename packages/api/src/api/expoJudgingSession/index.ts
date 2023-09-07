import { Router } from 'express';
import { post } from './post';
import { adminMiddleware } from '../../middleware/adminMiddleware';

export const project = Router();

project.post('', adminMiddleware, post);
