import * as Slack from '@slack/web-api';
import jwt_decode from 'jwt-decode';
import { dummyOAuth } from '../../../../src/api/auth/callback/dummyOAuth';
import { slack } from '../../../../src/api/auth/callback/slack';
import { getMock } from '../../../testUtils/getMock';

jest.mock('@slack/web-api');
jest.mock('jwt-decode');
jest.mock('../../../../src/api/auth/callback/dummyOAuth');

const mockToken = {
  ok: true,
  access_token: 'xoxp-1234',
  token_type: 'Bearer',
  id_token: 'mockIDToken',
};
const jwtDecodeMock = getMock(jwt_decode);
const webClientSpy = jest.spyOn(Slack, 'WebClient');
const dummyOAuthMock = getMock(dummyOAuth);

describe('Slack auth callback', () => {
  it('fetches a token using the correct args', async () => {
    const mockTokenMethod = jest.fn().mockReturnValueOnce(mockToken);
    jwtDecodeMock.mockReturnValueOnce({});
    const mockWebClient = { openid: { connect: { token: mockTokenMethod } } };
    webClientSpy.mockReturnValueOnce(mockWebClient as any);
    const mockReq = { query: { code: 'mockCode' } };

    await slack(mockReq as any);

    expect(mockTokenMethod).toHaveBeenCalledTimes(1);
    expect(mockTokenMethod).toHaveBeenCalledWith(
      expect.objectContaining({
        code: mockReq.query.code,
        redirect_uri: expect.stringContaining('/api/auth/callback/slack'),
      }),
    );
    expect(dummyOAuthMock).toHaveBeenCalledWith({});
  });

  it('fetches the correct user info', async () => {
    // Set up
    // Execute
    // Evaluate
  });
});
