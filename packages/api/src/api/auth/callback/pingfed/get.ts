import { Config } from '@hangar/shared';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { Request, Response } from 'express';
import { pingfedAuth } from '../../../../env/auth';
import { formatRedirectUri } from '../../utils/formatRedirectUri';
import { authenticateUser } from '../../utils/authenticateUser';

type TokenResponse = {
  access_token: string;
};
type TokenValues = {
  first_name: string;
  last_name: string;
  Email: string;
};

export const get = async (req: Request, res: Response) => {
  const returnTo = req.query[Config.global.authReturnUriParamName] as string | undefined;
  const { code } = req.query;

  if (!code) {
    res.redirect(`/error?description=${encodeURIComponent('Bad Auth Callback')}`);
    return;
  }

  try {
    const body = new URLSearchParams({
      client_id: pingfedAuth.clientId,
      client_secret: pingfedAuth.clientSecret,
      grant_type: 'authorization_code',
      redirect_uri: formatRedirectUri({ returnTo }),
      code: code as string,
    }).toString();

    const response = await axios.post<TokenResponse>(pingfedAuth.tokenBaseUrl, body, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'hangar-server', // Cannot be `axios/*` or PingFed will reject with 403
      },
    });
    const { access_token: token } = response.data as TokenResponse;

    const {
      first_name: firstName,
      last_name: lastName,
      Email: email,
    } = jwt_decode<TokenValues>(token as string);

    void authenticateUser({ req, res, data: { firstName, lastName, email, returnTo } });
  } catch (error) {
    res.redirect(`/error?description=${encodeURIComponent('Failed to get auth token')}`);
  }
};
