import { Schema } from '@hangar/shared';
import { Request, Response } from 'express';
import { ExpoJudgingSession, ExpoJudgingVote, Judge } from '@hangar/database';
import { validatePayload } from '../../utils/validatePayload';
import { logger } from '../../utils/logger';

export const post = async (req: Request, res: Response) => {
  const { entityManager, judge } = req;
  
  const { errorHandled, data } = validatePayload({
    req,
    res,
    schema: Schema.expoJudgingVote.post,
  });
  if (errorHandled) return;

  const { currentProjectChosen, expoJudgingSessionId } = data

  let expoJudgingSession: ExpoJudgingSession | undefined;
  try{
    expoJudgingSession = await entityManager.findOne(ExpoJudgingSession, {id:expoJudgingSessionId}) ?? undefined
  } catch (error) {
    logger.error(error);
    res.sendStatus(500);
    return;
  }

  if (!expoJudgingSession) {
    res.sendStatus(403);
    return;
  }

  try {
    const expoJudgingVote = await judge.vote({
      entityManager,
      currentProjectChosen,
      judgingSession: expoJudgingSession,
    });
    res.send(expoJudgingVote);
  } catch (error) {
    logger.error(error);
    res.sendStatus(500);
    return;
  }

};
