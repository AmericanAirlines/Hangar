import { Router } from 'express';
import { post } from './post';

export const skip = Router({ mergeParams: true });

skip.post('', post);
