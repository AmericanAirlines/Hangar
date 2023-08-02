import { slack } from '../../../src/api/auth/slack';

describe('auth SLACK', () => {
  it('redirects to correct url for happy path', async () => {
    const fullLink =
      'https://slack.com/openid/connect/authorize?scope=openid%20email%20profile&response_type=code&redirect_uri=undefined%2Fapi%2Fauth%2Fcallback%2Fslack&client_id=undefined';

    const mockRedirect = jest.fn();
    const mockReq = {};
    const mockRes = { redirect: mockRedirect };

    await slack(mockReq as any, mockRes as any);

    expect(mockRedirect).toHaveBeenCalledTimes(1);
    expect(mockRedirect).toHaveBeenCalledWith(fullLink);
  });
});
