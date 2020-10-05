import { App, AuthorizeResult, ExpressReceiver, LogLevel } from '@slack/bolt';
import { WebClient } from '@slack/web-api';
import getRequiredEnvVar from '../utilities/getRequiredEnvVar';
import actions from './actions';
import events from './events';
import views from './views';

export const receiver = new ExpressReceiver({ signingSecret: getRequiredEnvVar('SLACK_SIGNING_SECRET') });
let authorizeResult: AuthorizeResult;

let logLevel: LogLevel;
if (process.env.SLACK_LOG_LEVEL) {
  logLevel = process.env.SLACK_LOG_LEVEL as LogLevel;
} else {
  logLevel = process.env.NODE_ENV === 'development' ? LogLevel.DEBUG : LogLevel.INFO;
}

async function authorize(): Promise<AuthorizeResult> {
  // See if we already have the auth result;
  // if so, use that instead of hitting the API again
  if (authorizeResult) {
    return authorizeResult;
  }

  if (process.env.NODE_ENV === 'test') {
    // During testing, avoid hittin the API and use junk data
    authorizeResult = {
      botToken: 'junk test token',
      botId: 'junk bot id',
      botUserId: 'junk bot user id',
    };
    return authorizeResult;
  }

  const botToken = getRequiredEnvVar('SLACK_BOT_TOKEN');
  const client = new WebClient(botToken);
  const auth = (await client.auth.test()) as { [id: string]: string };
  authorizeResult = {
    botToken,
    botId: auth.bot_id,
    botUserId: auth.user_id,
  };

  return authorizeResult;
}

// Create a new bolt app using the receiver instance and authorize method above
export const app = new App({
  receiver,
  logLevel,
  authorize,
});

export function initListeners(): void {
  actions(app);
  events(app);
  views(app);
}

export const slackApp = receiver.app;
