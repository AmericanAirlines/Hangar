import { Request, Response } from 'express';
import { Config } from '@hangar/shared';
import { formatSlackAuthUrl, formatPingfedAuthUrl } from './utils/authUrlFormatters';

const { method: authMethod } = Config.Auth;

/**
 * Express handler that redirects to the appropriate auth url based on the auth method
 */
export const get = async (req: Request, res: Response) => {
  const { [Config.global.authReturnUriParamName]: returnTo } = req.query as Record<string, string>;

  let authUrl: string;
  if (authMethod === 'slack') {
    authUrl = formatSlackAuthUrl({ returnTo });
  } else {
    // Pingfed
    authUrl = formatPingfedAuthUrl({ returnTo });
  }

  res.redirect(authUrl);
};
