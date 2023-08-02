import { Request, Response } from 'express';
import { env } from '../../env';

const slackAuthBaseUrl: string =
  'https://slack.com/openid/connect/authorize?scope=openid%20email%20profile&response_type=code&';
const queryArgs = new URLSearchParams({
  redirect_uri: `${env.baseUrl}/api/auth/callback/get`,
  client_id: env.slackClientID,
});
const fullLink = `${slackAuthBaseUrl}${queryArgs.toString()}`;

export const get = async (req: Request, res: Response) => {
  res.redirect(fullLink);
};
