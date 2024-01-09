import { Config } from '@hangar/shared';
import { get } from '../../../src/api/auth/get';
import { createMockRequest } from '../../testUtils/expressHelpers/createMockRequest';
import { createMockResponse } from '../../testUtils/expressHelpers/createMockResponse';
import { formatRedirectUri } from '../../../src/api/auth/utils/formatRedirectUri';
import { getMock } from '../../testUtils/getMock';

const slackAuthBaseUrl: string =
  'https://slack.com/openid/connect/authorize?scope=openid%20email%20profile&response_type=code&';

const returnTo = '/api/expoJudgingSession';

jest.mock('../../../src/utils/auth/formatRedirectUri');
const formatRedirectUriMock = getMock(formatRedirectUri);

describe('auth SLACK', () => {
  it('redirects to correct url for happy path', async () => {
    const redirectUri = 'waffles';
    formatRedirectUriMock.mockReturnValueOnce(redirectUri);
    const fullLink = `${slackAuthBaseUrl}redirect_uri=${redirectUri}&client_id=undefined`;

    const mockReq = createMockRequest({
      query: {
        [Config.global.authReturnUriParamName]: returnTo,
      },
    });
    const mockRes = createMockResponse();

    await get(mockReq as any, mockRes as any);

    expect(formatRedirectUriMock).toBeCalledWith(expect.objectContaining({ returnTo }));
    expect(mockRes.redirect).toHaveBeenCalledTimes(1);
    expect(mockRes.redirect).toHaveBeenCalledWith(fullLink);
  });
});
