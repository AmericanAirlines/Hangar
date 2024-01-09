import { slackAuth } from '../../../../env/auth';
import { formatRedirectUri } from '../formatRedirectUri';
import { AuthUrlFormatter } from './types';

/**
 *
 * @returns {string} The URL to redirect to for the initial step of the auth flow
 */
export const formatSlackAuthUrl: AuthUrlFormatter = ({ returnTo }) => {
  const slackAuthBaseUrl: string =
    'https://slack.com/openid/connect/authorize?scope=openid%20email%20profile&response_type=code&';

  const queryArgs = new URLSearchParams({
    redirect_uri: formatRedirectUri({ returnTo }),
    client_id: slackAuth.slackClientID,
  }).toString();

  return `${slackAuthBaseUrl}${queryArgs}`;
};
