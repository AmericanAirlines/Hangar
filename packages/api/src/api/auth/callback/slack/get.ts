import { WebClient } from '@slack/web-api';
import { Request, Response } from 'express';
import jwt_decode from 'jwt-decode';
import { Config } from '@hangar/shared';
import { authenticateUser } from '../../utils/authenticateUser';
import { logger } from '../../../../utils/logger';
import { slackAuth } from '../../../../env/auth';
import { formatRedirectUri } from '../../utils/formatRedirectUri';

const codeQueryParam = 'code';
export type SlackTokenData = {
  email: string;
  given_name: string;
  family_name: string;
};

export const get = async (req: Request, res: Response) => {
  const myCode: string = req.query[codeQueryParam] as string;
  const { clientId, clientSecret, botToken } = slackAuth;

  const returnTo = req.query[Config.global.authReturnUriParamName] as string | undefined;

  const client = new WebClient(botToken);
  try {
    const fullToken = await client.openid.connect.token({
      code: myCode,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: formatRedirectUri({ returnTo }),
    });

    const {
      given_name: firstName,
      family_name: lastName,
      email,
    } = jwt_decode<SlackTokenData>(fullToken.id_token as string);

    // Replace this with Core OAuth flow
    await authenticateUser({ req, res, data: { firstName, lastName, email, returnTo } });
  } catch (error) {
    logger.error(error);
    res.redirect(`/error?description=${encodeURIComponent('Bad Slack Auth Callback')}`);
  }
};
