import { Schema } from '@hangar/shared';
import { Request, Response } from 'express';
import { ExpoJudgingSession } from '@hangar/database';
import { validatePayload } from '../../utils/validatePayload';
import { logger } from '../../utils/logger';

export const post = async (req: Request, res: Response) => {
  const { entityManager, admin } = req;

  const { errorHandled } = validatePayload({
    req,
    res,
    schema: Schema.expoJudgingSession.post,
  });
  if (errorHandled) return;

  let expoJudgingSession: ExpoJudgingSession | undefined;

  try {
    expoJudgingSession = new ExpoJudgingSession({
      createdBy: admin.user,
    });
    await entityManager.persistAndFlush(expoJudgingSession);
  } catch (error) {
    logger.error(error);
    res.sendStatus(500);
    return;
  }

  res.send(expoJudgingSession);
};
