import { Handler } from 'express';
import logger from '../../logger';
import { env } from '../../env';

export const requireAuth = (redirect = false): Handler => (req, res, next): void => {
  if (req.signedCookies?.authed === 'yes' || req.headers.authorization === env.adminSecret || req.headers.authorization === env.supportSecret) {
    next();
  } else if (redirect) {
    res.redirect('/login');
  } else {
    res.sendStatus(401);
    logger.error(
      `Unauthorized request has been made to ${req.originalUrl} from ${req.ip} with authorization: ${
        req.headers.authorization
      }. Request Body: ${JSON.stringify(req.body, null, 2)}`,
    );
  }
};
