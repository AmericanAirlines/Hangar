import { Router } from 'express';
import { get } from './get';

export const continueSession = Router({ mergeParams: true });

continueSession.get('', get);
