import { Router } from 'express';
import { QueryOrder } from '@mikro-orm/core';
import logger from '../logger';
import { Event } from '../entities/Event';

export const events = Router();

events.get('/', async (req, res) => {
  try {
    const availableEvents = await req.entityManager.find(Event, {}, {}, { start: QueryOrder.ASC });

    res.status(200).send(availableEvents);
  } catch (error) {
    const errorText = 'There was an issue getting events';
    logger.error(errorText, error);
    res.status(500).send(errorText);
  }
});
