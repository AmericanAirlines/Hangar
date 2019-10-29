import { App, ExpressReceiver, LogLevel } from '@slack/bolt';
import { Application } from 'express';
import actions from './actions';
import events from './events';

const receiver = new ExpressReceiver({ signingSecret: process.env.SLACK_SIGNING_SECRET });

export const slackApp = (token: string): Application => {
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
