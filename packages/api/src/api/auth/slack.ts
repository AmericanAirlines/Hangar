import { Request, Response } from 'express';
import { env } from '../../env';

export const slack = async (req: Request, res: Response) => {
  const linkBase: string =
    'https://slack.com/openid/connect/authorize?scope=openid%20email%20profile&response_type=code';
  // Make this an env variable
  const redirect: string =
    '&redirect_uri=https://1376-162-92-127-85.ngrok-free.app/api/callback/slack';
  // Does this need to be env?
  const client: string = `&client_id=${env.slackClientID}`;

  const fullLink = linkBase + redirect + client;
  res.redirect(fullLink);
};
