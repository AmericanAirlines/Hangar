import { Config } from '@hangar/shared';
import { env } from '../env';

type FormatSlackRedirectUriArgs = {
  returnTo?: string;
};

export const formatSlackRedirectUri = ({ returnTo }: FormatSlackRedirectUriArgs = {}) => {
  const params = new URLSearchParams();
  if (returnTo) {
    params.append(Config.global.authReturnUriParamName, returnTo);
  }

  const paramsString = params.toString();
  const returnToQuery = paramsString ? `?${paramsString}` : '';
  return `${env.baseUrl ?? ''}/api/auth/callback/slack${returnToQuery}`;
};
