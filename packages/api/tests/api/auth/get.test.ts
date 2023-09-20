import { Config } from '@hangar/shared';
import { get } from '../../../src/api/auth/get';
import { createMockRequest } from '../../testUtils/expressHelpers/createMockRequest';
import { createMockResponse } from '../../testUtils/expressHelpers/createMockResponse';

const slackAuthBaseUrl: string =
  'https://slack.com/openid/connect/authorize?scope=openid%20email%20profile&response_type=code&';

const returnTo = '/api/expoJudgingSession';
const redirect_uri = encodeURIComponent(
  `/api/auth/callback/slack?${Config.global.authReturnUriParamName}=${returnTo}`,
);
// const redirect_uri = `${slackCallbackUrl}=${Config.global.authReturnUriParamName}=${encodeURIComponent( '/api/auth/callback/slack')}`

describe('auth SLACK', () => {
  it('redirects to correct url for happy path', async () => {
    const fullLink = `${slackAuthBaseUrl}redirect_uri=${redirect_uri}&client_id=undefined`;

    const mockReq = createMockRequest({
      query: {
        [Config.global.authReturnUriParamName]: returnTo,
      },
    });
    const mockRes = createMockResponse();

    await get(mockReq as any, mockRes as any);

    expect(mockRes.redirect).toHaveBeenCalledTimes(1);
    expect(mockRes.redirect).toHaveBeenCalledWith(fullLink);
  });
});
