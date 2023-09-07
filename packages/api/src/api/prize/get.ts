import { Prize } from '@hangar/database';
import { QueryOrder } from '@mikro-orm/core';
import { Request, Response } from 'express';
import { logger } from '../../utils/logger';

export const get = async (req: Request, res: Response) => {
  const { entityManager } = req;
  try {
    const prizes = await entityManager.find(Prize, {}, { orderBy: { position: QueryOrder.DESC } });
    res.send(prizes);
  } catch (error) {
    logger.error('Unable to fetch prizes from DB: ', error);
    res.sendStatus(500);
  }
};
