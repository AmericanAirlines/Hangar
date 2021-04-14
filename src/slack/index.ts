import { App, AuthorizeResult, ExpressReceiver, LogLevel } from '@slack/bolt';
import { WebClient } from '@slack/web-api';
import { Application } from 'express';
import actions from './actions';
import events from './events';
import views from './views';
import { env } from '../env';
import { Config } from '../entities/config';

// export const receiver = new ExpressReceiver({ signingSecret: '8a5aa316c01dbc7e507456e039710096' }); // Maybe should be Config.getValueAs('slackSigningSecret', 'string', false) ?
let authorizeResult: AuthorizeResult;

let logLevel: LogLevel;
if (env.slackLogLevel) {
  logLevel = env.slackLogLevel as LogLevel;
} else {
  logLevel = env.nodeEnv === 'development' ? LogLevel.DEBUG : LogLevel.INFO;
}

const authorize = (botToken: string) => async (): Promise<AuthorizeResult> => {
  // See if we already have the auth result;
  // if so, use that instead of hitting the API again
  if (authorizeResult) {
    return authorizeResult;
  }

  if (env.nodeEnv === 'test') {
    // During testing, avoid hitting the API and use junk data
    authorizeResult = {
      botToken: 'junk test token',
      botId: 'junk bot id',
      botUserId: 'junk bot user id',
    };
    return authorizeResult;
  }

  const client = new WebClient(botToken);
  const auth = (await client.auth.test()) as { [id: string]: string };
  authorizeResult = {
    botToken,
    botId: auth.bot_id,
    botUserId: auth.user_id,
  };

  return authorizeResult;
};

export const getSlackAppAndInitListeners = async (): Promise<Application> => {
  const token = await Config.getValueAs('slackBotToken', 'string', false);

  const receiver = new ExpressReceiver({ signingSecret: await Config.getValueAs('slackSigningSecret', 'string', false) });

  // Create a new bolt app using the receiver instance and authorize method above
  const app = new App({
    receiver,
    logLevel,
    authorize: authorize(token),
  });

  actions(app);
  events(app);
  views(app);
  return receiver.app;
};
