import { Handler } from 'express';
import logger from '../../logger';
import { Config } from '../../entities/config';
import { getActivePlatform } from '../../common/index';

export const validateUser = (redirect = false): Handler => async (req, res, next): Promise<void> => {
  const activePlatform = await getActivePlatform();
  const adminSecret = await Config.getValueAs('adminSecret', 'string', false);

  logger.info(redirect.toString());

  if ((!adminSecret || activePlatform === null) && redirect) {
    logger.info('Redirected user to the setup page');
    res.redirect('/setup');
  } else {
    logger.info('validateUser calling next');
    next();
  }
};
