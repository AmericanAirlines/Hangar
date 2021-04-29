import { Handler } from 'express';
import logger from '../../logger';
import { Config } from '../../entities/config';
import { getActivePlatform } from '../../common/index';

import url = require('url');

export const requireAuth = (redirect = false): Handler => async (req, res, next): Promise<void> => {
  const adminSecret = await Config.getValueAs('adminSecret', 'string', false);
  const supportSecret = await Config.getValueAs('supportSecret', 'string', false);

  const activePlatform = await getActivePlatform();
  const appSetupComplete = adminSecret && activePlatform !== null;
  const path = url.parse(req.url).pathname;

  if (path === '/setup') {
    if (appSetupComplete) {
      res.redirect('/');
    } else {
      next();
    }
  } else if (path === '/bulk') {
    if (!appSetupComplete) {
      next();
    } else {
      res.end();
    }
  } else if (!appSetupComplete) {
    res.redirect('/setup');
  } else if (
    req.signedCookies?.authed === 'yes' ||
    (adminSecret && req.headers.authorization === adminSecret) ||
    (supportSecret && req.headers.authorization === supportSecret)
  ) {
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
