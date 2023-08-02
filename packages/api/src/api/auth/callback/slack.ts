import { WebClient } from '@slack/web-api';
import { Request, Response } from 'express';
import jwt_decode from 'jwt-decode';
import { env } from '../../../env';
import { dummyOAuth, OAuthArgs } from './dummyOAuth';

export const slack = async (req: Request, res: Response) => {
  const myCode: string = req.query.code as string;
  const { slackClientID, slackClientSecret } = env;

  const redirect: string = `${env.baseUrl}/api/auth/callback/slack`;

  const client = new WebClient(env.slackBotToken);
  const fullToken = await client.openid.connect.token({
    code: myCode,
    client_id: slackClientID,
    client_secret: slackClientSecret,
    redirect_uri: redirect,
  });

  const decoded = jwt_decode<OAuthArgs>(fullToken.id_token as string);

  // Replace this with Core OAuth flow
  dummyOAuth(decoded);
};
