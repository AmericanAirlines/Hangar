import { Router } from 'express';
import { post } from './post';
import { addUser } from '../../middleware/userMiddleware';

export const users = Router();

users.post( '', addUser, post );
