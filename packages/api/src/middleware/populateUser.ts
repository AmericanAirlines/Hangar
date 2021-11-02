import { Handler } from 'express';
import { User } from '../entities/User';
import logger from '../logger';

export const populateUser: Handler = async (req, res, next) => {
  try {
    const user = await req.entityManager.fork().findOne(User, { authId: req.user?.profile.id });

    if (!user) {
      res.sendStatus(401);
      logger.error('Unable to find user for request: ', req);
      return;
    }

    req.userEntity = user;

    next();
  } catch (err) {
    const errorText = 'Server error occurred while validating user';
    res.status(500).send(errorText);
    logger.error(errorText, err);
  }
};
