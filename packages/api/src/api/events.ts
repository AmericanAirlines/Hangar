import { Router } from 'express';
import { QueryOrder } from '@mikro-orm/core';
import logger from '../logger';
import { Event } from '../entities/Event';

export const events = Router();

events.get('/', async (req, res) => {
  try {
    const availableEvents = await req.entityManager.find(Event, {}, {}, { start: QueryOrder.ASC });

    // Check if user exists
    if (!availableEvents || availableEvents.length === 0) {
      res.sendStatus(404);
      return;
    }

    // Return stripped user information
    res.status(200).send(availableEvents);
  } catch (error) {
    logger.error(`There was an issue getting events`, error);
    res.status(500).send(`There was an issue getting events`);
  }
});