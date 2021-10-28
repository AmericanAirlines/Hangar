import { Router } from 'express';
import logger from '../logger';
import { Prize } from '../entities/Prize';

export const prizes = Router();

prizes.get('/', async (req, res) => {
  try {
    const allPrizes = await req.entityManager.find(Prize, {}, { orderBy: { isBonus: 'ASC', sortOrder: 'ASC' } });
    res.status(200).send(allPrizes);
  } catch (error) {
    const errorMsg = 'Uh oh, looks like there was an issue fetching the list of prizes!';
    logger.error(`${errorMsg}: `, error);
    res.status(500).send(errorMsg);
  }
});
