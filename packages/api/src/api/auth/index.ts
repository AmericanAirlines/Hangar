/* istanbul ignore file */
import { Router } from 'express';

export const auth = Router();

auth.use((_req, _res, next) => next());
