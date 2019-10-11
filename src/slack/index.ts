import { App, ExpressReceiver, LogLevel } from '@slack/bolt';
import actions from './actions';
import events from './events';

const receiver = new ExpressReceiver({ signingSecret: process.env.SLACK_SIGNING_SECRET });

const bolt = new App({
  receiver,
  token: process.env.SLACK_BOT_TOKEN,
  logLevel: process.env.NODE_ENV === 'development' ? LogLevel.DEBUG : LogLevel.INFO,
});

// Register listeners:
actions(bolt);
events(bolt);

export const slackApp = receiver.app;
