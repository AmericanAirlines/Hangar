import { Schema } from '@hangar/shared';
import { Request, Response } from 'express';
import { logger } from '../../utils/logger';
import { validatePayload } from '../../utils/validatePayload';

export const put = async (req: Request, res: Response) => {
  const { entityManager: em, user } = req;

  const { errorHandled, data } = validatePayload({ req, res, schema: Schema.user.put });

  if (errorHandled) return;

  try {
    user.assign(data);
    await em.persistAndFlush(user);
    res.send(user);
  } catch (err) {
    logger.error(err);
    res.sendStatus(500);
  }
};
