import { Event } from '@hangar/database';
import { QueryOrder } from '@mikro-orm/core';
import { Request, Response } from 'express';
import { logger } from '../../utils/logger';

export const get = async (req: Request, res: Response) => {
  const { entityManager } = req;
  try {
    const events = await entityManager.find(Event, {}, { orderBy: { start: QueryOrder.ASC } });
    res.send(events);
  } catch (error) {
    logger.error('Unable to fetch events from DB: ', error);
    res.sendStatus(500);
  }
};
