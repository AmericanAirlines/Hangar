import { Handler } from 'express';
import logger from '../../logger';
import { Config } from '../../entities/config';
import { getActivePlatform } from '../../common/index';

export const requireAuth = (redirect = false): Handler => async (req, res, next): Promise<void> => {
  const adminSecret = await Config.getValueAs('adminSecret', 'string', false);
  const supportSecret = await Config.getValueAs('supportSecret', 'string', false);
  const activePlatform = await getActivePlatform();

  logger.info(redirect.toString());

  if (!adminSecret || activePlatform === null) {
    // logger.info('Redirected to validateUser.ts');
    // next();
    logger.info('Redirected user to the setup page');
    res.redirect('/setup');
  } else if (
    req.signedCookies?.authed === 'yes' ||
    (adminSecret && req.headers.authorization === adminSecret) ||
    (supportSecret && req.headers.authorization === supportSecret)
  ) {
    logger.info('requireAuth passing it to next');
    next();
  } else if (redirect) {
    logger.info('redirecting to login');
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
