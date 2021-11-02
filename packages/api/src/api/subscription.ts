import { Router } from 'express';
import logger from '../logger';
import { User } from '../entities/User';

export const subscription = Router();

subscription.post('/subscribe', async (req, res) => {
  try {
    const user = await req.entityManager.findOne(User, { authId: req.user!.profile.id });
    if (user) {
      user.subscribed = true;
      await req.entityManager.flush();
      res.status(200).send(user);
    } else {
      res.status(404).send('User not found');
    }
  } catch (error) {
    const errorMsg = 'Uh oh, something went wrong while trying to enable your subscription!';
    logger.error(`${errorMsg}: `, error);
    res.status(500).send(errorMsg);
  }
});

subscription.post('/unsubscribe', async (req, res) => {
  try {
    const user = await req.entityManager.findOne(User, { authId: req.user!.profile.id });
    if (user) {
      user.subscribed = false;
      await req.entityManager.flush();
      res.status(200).send(user);
    } else {
      res.status(404).send('User not found');
    }
  } catch (error) {
    const errorMsg = 'Uh oh, something went wrong while trying to disable your subscription!';
    logger.error(`${errorMsg}: `, error);
    res.status(500).send(errorMsg);
  }
});
