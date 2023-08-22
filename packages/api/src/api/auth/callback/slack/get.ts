import { WebClient } from '@slack/web-api';
import { Request, Response } from 'express';
import jwt_decode from 'jwt-decode';
import { env } from '../../../../env';
import { authenticateUser } from '../../../../utils/authenticateUser';

export const codeQueryParam = 'code';
export type SlackTokenData = {
  email: string;
  given_name: string;
  family_name: string;
};

export const get = async (req: Request, res: Response) => {
  const myCode: string = req.query[codeQueryParam] as string;
  const { slackClientID, slackClientSecret } = env;

  const redirect: string = `${env.baseUrl}/api/auth/callback/slack/`;

  const client = new WebClient(env.slackBotToken);
  try {
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
    await authenticateUser({ req, res, data: { firstName, lastName, email } });
  } catch (error) {
    res.redirect(`/error?description=${encodeURIComponent('Bad Slack Auth Callback')}`);
  }
};
