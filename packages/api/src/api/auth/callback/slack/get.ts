import { WebClient } from '@slack/web-api';
import { Request, Response } from 'express';
import jwt_decode from 'jwt-decode';
import { env } from '../../../../env';
import { authenticateUser } from '../../../../utils/authenticateUser';

export type SlackTokenData = {
  email: string;
  given_name: string;
  family_name: string;
};

export const get = async (req: Request, res: Response) => {
  const myCode: string = req.query.code as string;
  const { slackClientID, slackClientSecret } = env;

  const redirect: string = `${env.baseUrl}/api/auth/callback/slack/`;

  const client = new WebClient(env.slackBotToken);
  const fullToken = await client.openid.connect.token({
    code: myCode,
    client_id: slackClientID,
    client_secret: slackClientSecret,
    redirect_uri: redirect,
  });

  const {
    given_name: firstName,
    family_name: lastName,
    email,
  } = jwt_decode<SlackTokenData>(fullToken.id_token as string);

  // Replace this with Core OAuth flow
  authenticateUser({ req, res, data: { firstName, lastName, email } });
};
