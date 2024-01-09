import { pingfedAuth } from '../../../../env/auth';
import { formatRedirectUri } from '../formatRedirectUri';
import { AuthUrlFormatter } from './types';

/**
 *
 * @returns The URL to redirect to for the initial step of the auth flow
 */
export const formatPingfedAuthUrl: AuthUrlFormatter = ({ returnTo }) => {
  const queryArgs = new URLSearchParams({
    redirect_uri: formatRedirectUri({ returnTo }),
    client_id: pingfedAuth.clientId,
    client_password: pingfedAuth.clientSecret,
    response_type: 'code',
  }).toString();

  return `${pingfedAuth.authBaseUrl}?${queryArgs}`;
};
