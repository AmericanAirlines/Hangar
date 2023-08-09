import { User } from '@hangar/database';
import { DriverException } from '@mikro-orm/core';
import { Request, Response } from 'express';
import { logger } from '../../utils/logger';

export const post = async (req: Request, res: Response) => {
  const { entityManager: em } = req;

  // TODO: Validate this payload effectively (covered in a separate user story)
  const { firstName, lastName } = req.body;
  const { email } = req.session; // Pull the email directly from the session so it cannot be modified

  try {
    const user = new User({ firstName, lastName, email });
    await em.persistAndFlush(user);
    req.session.id = user.id;
    res.send(user);
  } catch (err) {
    if ((err as DriverException).code === '23505') {
      res.status(409).send('User already exists');
    } else {
      logger.error(err);
      res.sendStatus(500);
    }
  }
};
