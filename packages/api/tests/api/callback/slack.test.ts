import * as Slack from '@slack/web-api';
import jwt_decode from 'jwt-decode';
import { dummyOAuth } from '../../../src/api/auth/callback/dummyOAuth';
import { slack } from '../../../src/api/auth/callback/slack';
import { getMock } from '../../testUtils/getMock';

jest.mock('@slack/web-api');
jest.mock('jwt-decode');
jest.mock('../../../src/api/auth/callback/dummyOAuth');

const mockToken = {
  ok: true,
  access_token: 'xoxp-1234',
  token_type: 'Bearer',
  // Encode JWT with mock data
  id_token: 'mockIDToken',
};
const jwtDecodeMock = getMock(jwt_decode);
const webClientSpy = jest.spyOn(Slack, 'WebClient');
const dummyOAuthMock = getMock(dummyOAuth);

describe('Slack auth callback', () => {
  it('fetches a token using the correct args', async () => {
    const mockTokenMethod = jest.fn().mockReturnValueOnce(mockToken);
    const mockWebClient = { openid: { connect: { token: mockTokenMethod } } };
    webClientSpy.mockReturnValueOnce(mockWebClient as any);
    const mockReq = { query: { code: 'mockCode' } };
    const mockRes = {};

    await slack(mockReq as any, mockRes as any);

    expect(mockTokenMethod).toHaveBeenCalledTimes(1);
    expect(mockTokenMethod).toHaveBeenCalledWith(
      expect.objectContaining({
        code: mockReq.query.code,
        redirect_uri: expect.stringContaining('/api/callback/slack'),
      }),
    );
    expect(dummyOAuthMock).toHaveBeenCalledWith();
  });

  // This is almost certainly bad
  // it('fetches the correct user info', async () => {
  //   const client = new WebClient('testToken');
  //   const spy = jest
  //     .spyOn(client.openid.connect, 'token')
  //     .mockResolvedValueOnce(mockToken as OpenIDConnectTokenResponse);
  // });
});
