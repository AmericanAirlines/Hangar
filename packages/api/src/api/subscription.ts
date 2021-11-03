import { Handler, Router } from 'express';
import logger from '../logger';
import { populateUser } from '../middleware/populateUser';

export const subscription = Router();
subscription.use(populateUser);

const subscriptionHandler =
  (subscribe: boolean): Handler =>
  async (req, res) => {
    try {
      const user = req.userEntity;

      user.subscribed = subscribe;
      await req.entityManager.persistAndFlush(user);

      res.send(user);
    } catch (error) {
      const errorMsg = 'Uh oh, something went wrong while trying to update your subscription!';
      logger.error(`${errorMsg}: `, error);
      res.status(500).send(errorMsg);
    }
  };

subscription.post('/subscribe', subscriptionHandler(true));

subscription.post('/unsubscribe', subscriptionHandler(false));
