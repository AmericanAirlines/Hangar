import { Request, Response } from 'express';
import { logger } from '../../utils/logger';

export const put = async (req: Request, res: Response) => {
  const { entityManager: em, user } = req;

  // TODO: Validate this payload effectively (covered in a separate user story)
  const { firstName, lastName } = req.body;

  try {
    user.assign({ firstName, lastName });
    await em.persistAndFlush(user);
    res.send(user);
  } catch (err) {
    logger.error(err);
    res.sendStatus(500);
  }
};
