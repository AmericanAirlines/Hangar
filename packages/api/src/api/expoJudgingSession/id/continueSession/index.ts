import { Router } from 'express';
import { get } from './get';

export const continueSession = Router();

continueSession.get('', get);
