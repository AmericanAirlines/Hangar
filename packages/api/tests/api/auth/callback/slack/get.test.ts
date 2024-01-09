import * as Slack from '@slack/web-api';
import { Config } from '@hangar/shared';
import jwt_decode from 'jwt-decode';
import { SlackTokenData, get } from '../../../../../src/api/auth/callback/slack/get';
import { getMock } from '../../../../testUtils/getMock';
import { authenticateUser } from '../../../../../src/api/auth/utils/authenticateUser';
import { createMockRequest } from '../../../../testUtils/expressHelpers/createMockRequest';
import { createMockResponse } from '../../../../testUtils/expressHelpers/createMockResponse';
import { formatRedirectUri } from '../../../../../src/api/auth/utils/formatRedirectUri';
import { slackAuth } from '../../../../../src/env/auth';

jest.mock('@slack/web-api');
jest.mock('jwt-decode');
jest.mock('../../../../../src/api/auth/utils/authenticateUser');
jest.mock('../../../../../src/api/auth/utils/formatRedirectUri');
jest.mock('../../../../../src/env/auth');

(slackAuth as Partial<typeof slackAuth>) = {
  slackClientID: 'mockClientID',
  slackBotToken: 'mockBotToken',
  slackClientSecret: 'mockClientSecret',
};

const mockToken = {
  ok: true,
  access_token: 'xoxp-1234',
  token_type: 'Bearer',
  id_token: 'mockIDToken',
};
const jwtDecodeMock = getMock(jwt_decode);
const webClientSpy = jest.spyOn(Slack, 'WebClient');
const authenticateUserMock = getMock(authenticateUser);
const formatRedirectUriMock = getMock(formatRedirectUri);

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
      const mockRedirectUri = 'pancakes';
      formatRedirectUriMock.mockReturnValueOnce(mockRedirectUri);

      await get(mockReq as any, {} as any);

      expect(webClientSpy).toBeCalledWith(slackAuth.slackBotToken);
      expect(mockTokenMethod).toHaveBeenCalledTimes(1);
      expect(mockTokenMethod).toHaveBeenCalledWith(
        expect.objectContaining({
          client_id: slackAuth.slackClientID,
          client_secret: slackAuth.slackClientSecret,
          code: mockReq.query.code,
          redirect_uri: mockRedirectUri,
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
});
