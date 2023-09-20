import { Request, Response } from 'express';
import { Judge, JudgingSession } from '@hangar/database';
import { Schema } from '@hangar/shared';
import { DriverException } from '@mikro-orm/core';
import { logger } from '../../utils/logger';
import { validatePayload } from '../../utils/validatePayload';

export const post = async (req: Request, res: Response) => {
  const { entityManager, user } = req;
  const { inviteCode } = req.query;
  const { errorHandled, data } = validatePayload({
    req,
    res,
    schema: Schema.judge.post,
    data: { inviteCode },
  });

  if (errorHandled) return;

  try {
    const judgingSession = await req.entityManager.findOne(JudgingSession, {
      inviteCode: data.inviteCode,
    });

    if (!judgingSession) {
      res.sendStatus(403);
      return;
    }

    const judge = new Judge({ user: user.toReference() });
    judge.expoJudgingSessions.add(judgingSession);

    await entityManager.persistAndFlush(judge);

    res.send(judge);
  } catch (error) {
    if ((error as DriverException).code === '23505') {
      res.sendStatus(409);
      return;
    }

    res.sendStatus(500);
    logger.error('Failed to create a judge', error);
  }
};
