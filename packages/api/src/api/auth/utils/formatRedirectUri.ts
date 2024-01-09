import { Config } from '@hangar/shared';
import { env } from '../../../env';

type FormatSlackRedirectUriArgs = {
  returnTo?: string;
};

const { method } = Config.Auth;

/**
 * A method to format a URL encoded redirect URI based on the configured auth method
 * @param {string} args.returnTo the uri to return the user to post-auth
 * @returns
 */
export const formatRedirectUri = ({ returnTo }: FormatSlackRedirectUriArgs = {}) => {
  const params = new URLSearchParams();
  if (returnTo) {
    params.append(Config.global.authReturnUriParamName, returnTo);
  }

  const paramsString = params.toString();
  const returnToQuery = paramsString ? `?${paramsString}` : '';

  return `${env.baseUrl ?? ''}/api/auth/callback/${method}/${returnToQuery}`;
};
