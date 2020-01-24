import { Handler } from 'express';

export const requireAuth: Handler = (req, res, next) => {
  if (req.signedCookies?.authed === 'yes') {
    next();
  } else {
    res.redirect('/login');
  }
};
