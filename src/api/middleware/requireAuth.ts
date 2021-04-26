import { Handler } from 'express';
import logger from '../../logger';
import { Config } from '../../entities/config';

export const requireAuth = (redirect = false): Handler => async (req, res, next): Promise<void> => {
  const adminSecret = await Config.getValueAs('adminSecret', 'string', false);
  const supportSecret = await Config.getValueAs('supportSecret', 'string', false);
  if (
    req.signedCookies?.authed === 'yes' ||
    (adminSecret && req.headers.authorization === adminSecret) ||
    (supportSecret && req.headers.authorization === supportSecret)
  ) {
    next();
  } else if (redirect) {
    if (!adminSecret) {
      res.redirect('/setup');
    } else {
      res.redirect('/login');
    }
  } else {
    res.sendStatus(401);
    logger.error(
      `Unauthorized request has been made to ${req.originalUrl} from ${req.ip} with authorization: ${
        req.headers.authorization
      }. Request Body: ${JSON.stringify(req.body, null, 2)}`,
    );
  }
};
