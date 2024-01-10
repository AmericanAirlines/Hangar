import {
  formatSlackAuthUrl,
  slackAuthBaseUrl,
} from '../../../../../../../src/api/auth/utils/authUrlFormatters/formatSlackAuthUrl';
import { formatRedirectUri } from '../../../../../../../src/api/auth/utils/formatRedirectUri';
import { slackAuth } from '../../../../../../../src/env/auth/slackAuth';
import { getMock } from '../../../../../../testUtils/getMock';

jest.mock('../../../../../../../src/env/auth/slackAuth');
jest.mock('../../../../../../../src/api/auth/utils/formatRedirectUri');
const formatRedirectUriMock = getMock(formatRedirectUri);

(slackAuth as Partial<typeof slackAuth>) = {
  clientId: 'mockClientId',
};

describe('formatSlackAuthUrl', () => {
  it('formats the slack auth url correctly', () => {
    const returnTo = '/api/health';
    const mockRedirectUri = 'mockRedirectUri';
    formatRedirectUriMock.mockReturnValueOnce(mockRedirectUri);

    const redirectUri = formatSlackAuthUrl({ returnTo });

    expect(formatRedirectUriMock).toBeCalledTimes(1);
    expect(formatRedirectUriMock).toBeCalledWith({ returnTo });

    expect(redirectUri).toEqual(
      `${slackAuthBaseUrl}redirect_uri=${mockRedirectUri}&client_id=${slackAuth.clientId}`,
    );
  });
});
