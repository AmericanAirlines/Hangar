import { Request, Response } from 'express';
import { Judge, User } from '@hangar/database';
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
  // Incomplete
};
