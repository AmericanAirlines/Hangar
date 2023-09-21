import { Config } from '@hangar/shared';
import { env } from '../env';

type FormatSlackRedirectUriArgs = {
  returnTo?: string;
};

export const formatSlackRedirectUri = ({ returnTo }: FormatSlackRedirectUriArgs = {}) => {
  const returnToQuery = returnTo ? `?${Config.global.authReturnUriParamName}=${returnTo}` : '';
  return `${env.baseUrl ?? ''}/api/auth/callback/slack${returnToQuery}`;
};
