import { Schema } from '@hangar/shared';
import { Request, Response } from 'express';
import { ExpoJudgingSession } from '@hangar/database';
import { validatePayload } from '../../utils/validatePayload';
import { logger } from '../../utils/logger';

export const post = async (req: Request, res: Response) => {
  const { entityManager, judge } = req;
  console.log(req.body)
  const { errorHandled, data } = validatePayload({
    req,
    res,
    schema: Schema.expoJudgingVote.post,
  });
  if (errorHandled) return;

  const { currentProjectChosen, expoJudgingSessionId } = data;

  try {
    const expoJudgingSession =
      (await entityManager.findOne(ExpoJudgingSession, { id: expoJudgingSessionId })) ?? undefined;
    if (!expoJudgingSession) {
      res.sendStatus(404);
      return;
    }

    await entityManager.populate(judge, ['expoJudgingSessionContexts']);
    console.log('a',judge.expoJudgingSessionContexts.getItems())
    const hasPermission = judge.expoJudgingSessionContexts
      .getItems()
      .some(({ expoJudgingSession: ejs }) => ejs.id === expoJudgingSessionId);

    if (!hasPermission) {
      res.sendStatus(403);
      return;
    }

    const expoJudgingVote = await judge.vote({
      entityManager,
      currentProjectChosen,
      expoJudgingSession,
    });

    res.send(expoJudgingVote);
  } catch (error) {
    logger.error('Error occurred while creating ExpoJudgingVote', error);
    res.sendStatus(500);
  }
};
