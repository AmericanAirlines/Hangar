import { Config } from '@hangar/shared';
import { createMockRequest } from '../../testUtils/expressHelpers/createMockRequest';
import { createMockResponse } from '../../testUtils/expressHelpers/createMockResponse';
import { formatRedirectUri } from '../../../src/api/auth/utils/formatRedirectUri';
import { getMock } from '../../testUtils/getMock';
import {
  formatPingfedAuthUrl,
  formatSlackAuthUrl,
} from '../../../src/api/auth/utils/authUrlFormatters';

const returnTo = '/api/expoJudgingSession';

jest.mock('@hangar/shared');
jest.mock('../../../src/api/auth/utils/authUrlFormatters');
jest.mock('../../../src/env/auth', () => ({ slackAuth: {}, pingfedAuth: {} }));
const formatSlackAuthUrlMock = getMock(formatSlackAuthUrl);
const formatPingfedAuthUrlMock = getMock(formatPingfedAuthUrl);

describe('auth login redirect', () => {
  describe('slack redirect', () => {
    beforeEach(() => {
      Config.Auth.method = 'slack';
    });

    it('redirects to correct url for happy path', async () => {
      await jest.isolateModulesAsync(async () => {
        const { get } = await import('../../../src/api/auth/get');
        const redirectUri = 'waffles';
        formatSlackAuthUrlMock.mockReturnValueOnce(redirectUri);

        const mockReq = createMockRequest({
          query: {
            [Config.global.authReturnUriParamName]: returnTo,
          },
        });
        const mockRes = createMockResponse();

        await get(mockReq as any, mockRes as any);

        expect(formatSlackAuthUrlMock).toBeCalledTimes(1);
        expect(formatSlackAuthUrlMock).toBeCalledWith(expect.objectContaining({ returnTo }));
        expect(mockRes.redirect).toHaveBeenCalledTimes(1);
        expect(mockRes.redirect).toHaveBeenCalledWith(redirectUri);
      });
    });
  });

  describe('pingfed redirect', () => {
    beforeEach(() => {
      Config.Auth.method = 'pingfed';
    });

    it('redirects to correct url for happy path', async () => {
      await jest.isolateModulesAsync(async () => {
        const { get } = await import('../../../src/api/auth/get');
        const redirectUri = 'pancakes';
        formatPingfedAuthUrlMock.mockReturnValueOnce(redirectUri);

        const mockReq = createMockRequest({
          query: {
            [Config.global.authReturnUriParamName]: returnTo,
          },
        });
        const mockRes = createMockResponse();

        await get(mockReq as any, mockRes as any);

        expect(formatPingfedAuthUrlMock).toBeCalledTimes(1);
        expect(formatPingfedAuthUrlMock).toBeCalledWith(expect.objectContaining({ returnTo }));
        expect(mockRes.redirect).toHaveBeenCalledTimes(1);
        expect(mockRes.redirect).toHaveBeenCalledWith(redirectUri);
      });
    });
  });
});
