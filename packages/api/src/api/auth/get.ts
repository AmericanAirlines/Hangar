import { Request, Response } from 'express';
import { env } from '../../env';
import { slackCallbackUrl } from './callback/slack/get';

export type QueryArgs = {
  returnTo?: string;
  slackCallbackUrl: string;
  env: {
    readonly nodeEnv: string;
    readonly port: string;
    readonly baseUrl: string;
    readonly sessionSecret: string;
    readonly slackBotToken: string;
    readonly slackSigningSecret: string;
    readonly slackClientID: string;
    readonly slackClientSecret: string;
    readonly slackLogLevel?: string | undefined;
  };
};

const slackAuthBaseUrl: string =
  'https://slack.com/openid/connect/authorize?scope=openid%20email%20profile&response_type=code&';

const queryArgs = ({ slackCallbackUrl, env, returnTo }:QueryArgs) =>
  new URLSearchParams({
    redirect_uri: returnTo || slackCallbackUrl,
    client_id: env.slackClientID,
  });

const fullLink = `${slackAuthBaseUrl}${queryArgs({slackCallbackUrl, env}).toString()}`;

export const get = async (req: Request, res: Response) => {
  res.redirect(fullLink);
};
