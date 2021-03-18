import { Handler } from 'express';
import logger from '../../logger';
import { Config } from '../../entities/config';

export const requireAuth = (redirect = false): Handler => async (req, res, next): Promise<void> => {
  const adminSecret = await Config.findOne("adminSecret");
  const supportSecret = await Config.findOne("supportSecret");
  if (req.signedCookies?.authed === 'yes' || req.headers.authorization === adminSecret.value || 
  (req.headers.authorization === supportSecret.value && supportSecret.value != '' && adminSecret.value != '')) {
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
