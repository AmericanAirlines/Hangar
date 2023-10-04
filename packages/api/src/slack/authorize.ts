import { AuthorizeResult } from '@slack/bolt';
import { WebClient } from '@slack/web-api';
import { env } from '../env';

let authorizeResult: AuthorizeResult;

export const authorize = (botToken: string) => async (): Promise<AuthorizeResult> => {
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
