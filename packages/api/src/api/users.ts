import { Router } from 'express';
import { User } from '../entities/User';
import { populateUser } from '../middleware/populateUser';
import logger from '../logger';

export const users = Router();
users.use(populateUser());

users.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    // Check if userId is in correct format
    if (Number.isNaN(Number(userId))) {
      res.status(400).send('The user id must be a number');
      return;
    }

    const user = await req.entityManager.findOne(User, { id: userId });

    // Check if user exists
    if (!user) {
      res.sendStatus(404);
      return;
    }

    res.send(user.toSafeJSON(req));
  } catch (error) {
    logger.error(`There was an issue getting user "${userId}"`, error);
    res.status(500).send('There was an issue getting user');
  }
});
