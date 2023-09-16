import { get } from '../../../src/api/auth/get';
import { createMockRequest } from '../../testUtils/expressHelpers/createMockRequest';
import { createMockResponse } from '../../testUtils/expressHelpers/createMockResponse';

describe('auth SLACK', () => {
  it('redirects to correct url for happy path', async () => {
    const fullLink = `https://slack.com/openid/connect/authorize?scope=openid%20email%20profile&response_type=code&redirect_uri=${encodeURIComponent(
      '/api/auth/callback/slack',
    )}&client_id=undefined`;

    const mockReq = createMockRequest();
    const mockRes = createMockResponse();

    await get(mockReq as any, mockRes as any);

    expect(mockRes.redirect).toHaveBeenCalledTimes(1);
    expect(mockRes.redirect).toHaveBeenCalledWith(fullLink);
  });
});
