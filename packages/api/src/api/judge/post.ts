import { Request, Response } from 'express';
import { Judge, User, JudgingSession } from '@hangar/database';
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

  try {
    const judgingSession = await req.entityManager.findOne(JudgingSession, {
      inviteCode: data?.inviteCode,
    });
    if (data?.inviteCode === judgingSession?.inviteCode) {
      res.sendStatus(200);
    }
  } catch {
    res.sendStatus(403);
  }
  // Still need to add 2 more functionality
};
