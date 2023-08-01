import { WebClient } from '@slack/web-api';
import { Request, Response } from 'express';
import jwt_decode from 'jwt-decode';
import { env } from '../../env';

export type OAuthArgs = {
  email: string;
  given_name: string;
  family_name: string;
};

const dummyOAuth = ({ email, given_name: firstName, family_name: lastName }: OAuthArgs) => {
  console.log('Args: ', email, firstName, lastName);

  return { email, firstName, lastName };
};

export const slack = async (req: Request, res: Response) => {
  const myCode: string = req.query.code as string;
  const { slackClientID, slackClientSecret } = env;

  // Make this an env variable
  const redirect: string = 'https://1376-162-92-127-85.ngrok-free.app/api/callback/slack';

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

  res.redirect('/');
};
