import { Router } from 'express';
import { initSlack } from '../../slack';
import { events } from './events';

export const slack = Router();

const { app: slackApp, bolt } = initSlack();

slack.use(slackApp); // Also registers the event challenge handler at /api/slack/events

events(bolt);
