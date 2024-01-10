import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { get } from '../../../../../src/api/auth/callback/pingfed/get';
import { createMockRequest } from '../../../../testUtils/expressHelpers/createMockRequest';
import { createMockResponse } from '../../../../testUtils/expressHelpers/createMockResponse';
import { getMock } from '../../../../testUtils/getMock';
import { authenticateUser } from '../../../../../src/api/auth/utils/authenticateUser';

jest.mock('axios', () => ({
  __esModule: true,
  default: { post: jest.fn() },
}));
jest.mock('jwt-decode');
jest.mock('../../../../../src/api/auth/utils/authenticateUser');
const jwtDecodeMock = getMock(jwt_decode);

describe('Pingfed auth callback', () => {
  it('parses the code correctly, fetches a token, and decodes it into user properties', async () => {
    const mockCode = 'mockCode';
    const mockReq = createMockRequest({
      query: { code: mockCode },
    });
    const mockRes = createMockResponse();

    const mockToken = 'mockToken';
    (axios.post as jest.Mock).mockResolvedValueOnce({ data: { access_token: mockToken } });
    const mockTokenValues = {
      first_name: 'mockFirstName',
      last_name: 'mockLastName',
      Email: 'mockEmail',
    };
    jwtDecodeMock.mockReturnValueOnce(mockTokenValues);

    await get(mockReq as any, mockRes as any);

    expect(jwtDecodeMock).toHaveBeenCalledWith(mockToken);
    expect(authenticateUser).toHaveBeenCalledWith({
      req: mockReq,
      res: mockRes,
      data: expect.objectContaining({
        firstName: mockTokenValues.first_name,
        lastName: mockTokenValues.last_name,
        email: mockTokenValues.Email,
      }),
    });
  });

  it('redirects to an error page if a code is not present', async () => {
    const mockReq = createMockRequest();
    const mockRes = createMockResponse();

    await get(mockReq as any, mockRes as any);

    expect(mockRes.redirect).toBeCalledWith(`/error?description=Bad%20Auth%20Callback`);
  });

  it('redirects to an error page if the token could not be fetched', async () => {
    const mockReq = createMockRequest({
      query: { code: 'mockCode' },
    });
    const mockRes = createMockResponse();

    (axios.post as jest.Mock).mockRejectedValueOnce(new Error('mockError'));

    await get(mockReq as any, mockRes as any);

    expect(mockRes.redirect).toBeCalledWith(`/error?description=Failed%20to%20get%20auth%20token`);
  });
});
