import { Project } from '@hangar/database';
import { Request, Response } from 'express';
import { logger } from '../../../utils/logger';
import { validatePayload } from '../../../utils/validatePayload';
import { errorMonitor } from 'events';

export const get = async (req: Request, res: Response) => {
  const { entityManager, user } = req;
  const { errorHandled, id } = validatePayload({
    req,
    res,
  });

    // need to add functionality

  if (errorHandled) return;
  try {
    // need to add functionality

  }catch(){
    // need to add functionality

  }
};
