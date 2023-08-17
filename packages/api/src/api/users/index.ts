import { Router } from 'express';
import { post } from './post';
import { validateSession } from '../../middleware/validateSessionMiddleware';

export const users = Router();

users.post( '', validateSession, post );
