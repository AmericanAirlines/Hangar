import { ExpoJudgingSession, Judge } from '@hangar/database';
import { Request, Response } from 'express';
import { logger } from '../../../../utils/logger';

export const post = async (req: Request, res: Response) => {
  const {
    entityManager: em,
    // judge,
    // params: { id: ejsId },
  } = req;

  try {
    const judge = await em.findOne(Judge, {id:'1'}) as Judge;
    const ejsId = '1'
    console.log(ejsId,judge)
    const ejs = await em.findOne(ExpoJudgingSession, { id: ejsId as string });
    if (!ejs) {
      res.sendStatus(404);
      return;
    }
    console.log(11)

    await em.populate(judge, ['expoJudgingSessionContexts']);
    console.log(22)
    const hasAccess = judge.expoJudgingSessionContexts
      .getItems()
      .some((ejsc) => ejsc.expoJudgingSession.id === ejsId);
      console.log(33)

    if (!hasAccess) {
      res.sendStatus(403);
      return;
    }
    console.log(44,{ entityManager: em, expoJudgingSession: ejs })

    await judge.continue({ entityManager: em, expoJudgingSession: ejs });
    console.log(55)
    res.sendStatus(204);
  } catch (error) {
    // TODO: Error handling for various continue client errors

    logger.error('Failed to continue Project', error);
    console.log(66)
    res.sendStatus(500);
  }
};
