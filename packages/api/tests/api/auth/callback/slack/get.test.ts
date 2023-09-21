import * as Slack from '@slack/web-api';
import jwt_decode from 'jwt-decode';
import { SlackTokenData, get } from '../../../../../src/api/auth/callback/slack/get';
import { getMock } from '../../../../testUtils/getMock';
import { authenticateUser } from '../../../../../src/utils/authenticateUser';
import { mockEnv } from '../../../../testUtils/mockEnv';
import { createMockRequest } from '../../../../testUtils/expressHelpers/createMockRequest';
import { createMockResponse } from '../../../../testUtils/expressHelpers/createMockResponse';
import { Config } from '@hangar/shared';

jest.mock('@slack/web-api');
jest.mock('jwt-decode');
jest.mock('../../../../../src/utils/authenticateUser');

const mockToken = {
  ok: true,
  access_token: 'xoxp-1234',
  token_type: 'Bearer',
  id_token: 'mockIDToken',
};
const jwtDecodeMock = getMock(jwt_decode);
const webClientSpy = jest.spyOn(Slack, 'WebClient');
const authenticateUserMock = getMock(authenticateUser);

describe('Slack auth callback', () => {
  describe('handler', () => {
    it('fetches a token using the correct args', async () => {
      const mockTokenMethod = jest.fn().mockReturnValueOnce(mockToken);
      const mockUserData: SlackTokenData = {
        email: 'user@domain.com',
        given_name: 'Lorem',
        family_name: 'Ipsum',
      };
      jwtDecodeMock.mockReturnValueOnce(mockUserData);
      const mockWebClient = { openid: { connect: { token: mockTokenMethod } } };
      webClientSpy.mockReturnValueOnce(mockWebClient as any);
      const returnToMock = '/api/expoJudgingSession';
      const mockReq = createMockRequest({
        query: { code: 'mockCode', [Config.global.authReturnUriParamName]: returnToMock },
      });

      await get(mockReq as any, {} as any);

      expect(mockTokenMethod).toHaveBeenCalledTimes(1);
      expect(mockTokenMethod).toHaveBeenCalledWith(
        expect.objectContaining({
          code: mockReq.query.code,
          redirect_uri: expect.stringContaining('/api/auth/callback/slack'),
        }),
      );
      expect(authenticateUserMock).toHaveBeenCalledWith(
        expect.objectContaining({
          data: {
            firstName: mockUserData.given_name,
            lastName: mockUserData.family_name,
            email: mockUserData.email,
            returnTo: returnToMock,
          },
        }),
      );
    });

    it('redirects to an error page if an error occurs', async () => {
      const mockTokenMethod = jest.fn().mockRejectedValueOnce(new Error('Something went wrong'));
      const mockWebClient = { openid: { connect: { token: mockTokenMethod } } };
      webClientSpy.mockReturnValueOnce(mockWebClient as any);
      const mockReq = createMockRequest({ query: { code: 'mockCode' } });
      const mockRes = createMockResponse();

      await get(mockReq as any, mockRes as any);

      expect(mockRes.redirect).toBeCalledWith(expect.stringContaining('error'));
    });
  });

  describe('callback URL', () => {
    it('uses baseUrl if it exists', async () => {
      await jest.isolateModulesAsync(async () => {
        const mockBaseUrl = 'https://aa.com';
        mockEnv({ baseUrl: mockBaseUrl });
        const { slackCallbackUrl } = await import('../../../../../src/api/auth/callback/slack/get');
        expect(slackCallbackUrl).toBe(`${mockBaseUrl}/api/auth/callback/slack`);
      });
    });

    it('defaults to an empty string if baseUrl is undefined', async () => {
      await jest.isolateModulesAsync(async () => {
        mockEnv();
        const { slackCallbackUrl } = await import('../../../../../src/api/auth/callback/slack/get');
        expect(slackCallbackUrl).toBe(`/api/auth/callback/slack`);
      });
    });
  });
});
