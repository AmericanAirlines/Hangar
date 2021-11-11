import { Router } from 'express';
import { User } from '../entities/User';
import logger from '../logger';

export const onboarding = Router();

onboarding.post('', async (req, res) => {
  const { name = '', email: rawEmail = '' } = req.body;
  const email = (rawEmail as string).toLowerCase();

  if ([name, email].some((val) => !val)) {
    res.status(400).send('All onboarding fields are required');
    return;
  }

  if (!email.match(/.edu$/)) {
    res.status(400).send('Email must be a valid student email ending in .edu');
    return;
  }

  const { user } = req;
  /* istanbul ignore next */
  if (!user) {
    // This shouldn't be possible - this is a session-protected endpoint
    res.sendStatus(500);
    return;
  }

  try {
    const newUser = new User({ name, email, authId: user.profile.id });
    await req.entityManager.persistAndFlush(newUser);

    res.sendStatus(200);
  } catch (err) {
    const errText = 'Something went wrong creating a user';
    res.status(500).send(errText);
    logger.error(`${errText}: `, err);
  }
});
