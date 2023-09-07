import { Schema } from '@hangar/shared';
import { Request, Response } from 'express';
import { Admin, ExpoJudgingSession } from '@hangar/database';
import { DriverException, LockMode } from '@mikro-orm/core';
import { validatePayload } from '../../utils/validatePayload';
import { logger } from '../../utils/logger';

export const post = async (req: Request, res: Response) => {
  const { entityManager, user } = req;

  const { errorHandled } = validatePayload({
    req,
    res,
    schema: Schema.expoJudgingSession.expoJudgingSessionPost,
  });
  if (errorHandled) return;

  let expoJudgingSession: ExpoJudgingSession | undefined;

  try {
    await entityManager.transactional(async (em) => {
      const lockedAdmin = await em.findOneOrFail(
        Admin,
        { user },
        { lockMode: LockMode.PESSIMISTIC_WRITE_OR_FAIL },
      );

      expoJudgingSession = new ExpoJudgingSession({
        createdBy: lockedAdmin.user,
      });

      em.persist(expoJudgingSession);
    });
  } catch (error) {
    if ((error as Error).name === 'NotFoundError') {
      res.sendStatus(409);
      return;
    }
    if ((error as DriverException).code === '55P03') {
      // Locking error
      res.sendStatus(423);
      return;
    }
    // All other errors
    logger.error(error);
    res.sendStatus(500);
    return;
  }

  res.send(expoJudgingSession);
};
