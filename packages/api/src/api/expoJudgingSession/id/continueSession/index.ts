import { Router } from 'express';
import { post } from './post';

export const continueSession = Router({ mergeParams: true });

continueSession.post('', post);
