import * as Slack from '@slack/web-api';
import jwt_decode from 'jwt-decode';
import { SlackTokenData, get } from '../../../../src/api/auth/callback/slack/get';
import { getMock } from '../../../testUtils/getMock';
import { authenticateUser } from '../../../../src/utils/authenticateUser';

jest.mock('@slack/web-api');
jest.mock('jwt-decode');
jest.mock('../../../../src/utils/authenticateUser');

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
    const mockReq = { query: { code: 'mockCode' } };

    await get(mockReq as any, {} as any);

    expect(mockTokenMethod).toHaveBeenCalledTimes(1);
    expect(mockTokenMethod).toHaveBeenCalledWith(
      expect.objectContaining({
        code: mockReq.query.code,
        redirect_uri: expect.stringContaining('/api/auth/callback/get'),
      }),
    );
    expect(authenticateUserMock).toHaveBeenCalledWith(
      expect.objectContaining({
        data: {
          firstName: mockUserData.given_name,
          lastName: mockUserData.family_name,
          email: mockUserData.email,
        },
      }),
    );
  });
});
