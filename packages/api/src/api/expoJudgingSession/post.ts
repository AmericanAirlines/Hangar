import { Schema } from '@hangar/shared';
import { Request, Response } from 'express';
import { ExpoJudgingSession } from '@hangar/database';
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
    expoJudgingSession = new ExpoJudgingSession({
      createdBy: user.toReference(),
    });
    await entityManager.persistAndFlush(expoJudgingSession);
  } catch (error) {
    // All other errors
    logger.error(error);
    res.sendStatus(500);
    return;
  }

  res.send(expoJudgingSession);
};
