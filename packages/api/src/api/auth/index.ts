import { Router } from 'express';
import { get } from './get';
import { callback } from './callback';
import { logout } from './logout';

export const auth = Router();

auth.get('/', get);
auth.use('/callback', callback);
auth.use('/logout', logout);
