import { ExpoJudgingSession, ExpoJudgingVote } from '@hangar/database';
import { Request, Response } from 'express';
import { logger } from '../../../../utils/logger';

export const get = async (req: Request, res: Response) => {
  const {
    entityManager: em,
    params: { id: ejsId },
    user,
    judge
  } = req;

  try {
    const ejs = await em.findOne(ExpoJudgingSession, {id: ejsId as string})
    if(!ejs){
        res.sendStatus(404);
        return:
    }

    await em.populate(judge, ['expoJudgingSessionContexts'])
  }
};
