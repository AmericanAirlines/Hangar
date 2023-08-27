import { Request, Response } from 'express';
import { env } from '../../env';
import { slackCallbackUrl } from './callback/slack/get';

const slackAuthBaseUrl: string =
  'https://slack.com/openid/connect/authorize?scope=openid%20email%20profile&response_type=code&';
const queryArgs = new URLSearchParams({
  redirect_uri: slackCallbackUrl,
  client_id: env.slackClientID,
});
const fullLink = `${slackAuthBaseUrl}${queryArgs.toString()}`;

export const get = async (req: Request, res: Response) => {
  res.redirect(fullLink);
};
