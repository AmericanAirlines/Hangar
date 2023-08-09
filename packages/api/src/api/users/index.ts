import { Router } from 'express';
import { post } from './post';

export const users = Router();

users.post(
  '',
  (req, res, next) => {
    if (!req.session.email) {
      // User does not have a valid session
      res.sendStatus(401);
      return;
    }
    next();
  },
  post,
);
