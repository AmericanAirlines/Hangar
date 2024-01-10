import { formatPingfedAuthUrl } from '../../../../../../../src/api/auth/utils/authUrlFormatters/formatPingfedAuthUrl';
import { formatRedirectUri } from '../../../../../../../src/api/auth/utils/formatRedirectUri';
import { pingfedAuth } from '../../../../../../../src/env/auth/pingfedAuth';
import { getMock } from '../../../../../../testUtils/getMock';

jest.mock('../../../../../../../src/env/auth/pingfedAuth');
jest.mock('../../../../../../../src/api/auth/utils/formatRedirectUri');
const formatRedirectUriMock = getMock(formatRedirectUri);

(pingfedAuth as Partial<typeof pingfedAuth>) = {
  authBaseUrl: 'https://mock.com',
  clientId: 'mockClientId',
  clientSecret: 'mockClientSecret',
};

describe('formatPingfedAuthUrl', () => {
  it('formats the pingfed auth url correctly', () => {
    const returnTo = '/api/health';
    const mockRedirectUri = 'mockRedirectUri';
    formatRedirectUriMock.mockReturnValueOnce(mockRedirectUri);

    const redirectUri = formatPingfedAuthUrl({ returnTo });

    expect(formatRedirectUriMock).toBeCalledTimes(1);
    expect(formatRedirectUriMock).toBeCalledWith({ returnTo });

    expect(redirectUri).toEqual(
      `${pingfedAuth.authBaseUrl}?redirect_uri=${mockRedirectUri}&client_id=${pingfedAuth.clientId}&client_password=${pingfedAuth.clientSecret}&response_type=code`,
    );
  });
});
