import { App, ExpressReceiver, LogLevel } from '@slack/bolt';
import { WebClient } from '@slack/web-api';
import { Application } from 'express';
import actions from './actions';
import events from './events';

const receiver = new ExpressReceiver({ signingSecret: process.env.SLACK_SIGNING_SECRET });

const token = process.env.SLACK_BOT_TOKEN;

export function getWebClient(): WebClient {
  return new WebClient(token);
}

export const slackApp = (): Application => {
  const bolt = new App({
    receiver,
    token,
    logLevel: process.env.NODE_ENV === 'development' ? LogLevel.DEBUG : LogLevel.INFO,
  });

  // Register listeners:
  actions(bolt);
  events(bolt);

  return receiver.app;
};
