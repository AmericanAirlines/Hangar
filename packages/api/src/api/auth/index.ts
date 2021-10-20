/* istanbul ignore file */
import { Router } from 'express';
import { gitHub } from './gitHub';

export const auth = Router();

auth.use(gitHub);
