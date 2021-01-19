import 'jest';
import { Request, Response, NextFunction } from 'express';
import logger from '../../../logger';

const adminSecret = 'Secrets are secretive';
process.env.ADMIN_SECRET = adminSecret;
const supportSecret = 'This secret is supportive!';
process.env.SUPPORT_SECRET = supportSecret;
// eslint-disable-next-line import/first
import { requireAuth } from '../../../api/middleware/requireAuth';

jest.spyOn(logger, 'error').mockImplementation();

const getMockRequest = (): Request =>
  // eslint-disable-next-line implicit-arrow-linebreak
  (({
    headers: {
      authorization: "AH AH AH... YOU DIDN'T SAY THE MAGIC WORD!",
    },
  } as Partial<Request>) as Request);

const mockRes = ({
  redirect: jest.fn(),
  sendStatus: jest.fn(),
} as Partial<Response>) as Response;

const mockNext: NextFunction = jest.fn();

describe('requireAuth middleware', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('rejects unauthorized traffic', () => {
    const mockRequest = getMockRequest();
    requireAuth()(mockRequest, mockRes, mockNext);
    expect(mockNext).not.toBeCalled();
    expect(mockRes.sendStatus).toBeCalledWith(401);
    expect(logger.error).toBeCalled();
  });

  it('redirects unauthorized traffic if needed', () => {
    const mockRequest = getMockRequest();
    const redirect = true;
    requireAuth(redirect)(mockRequest, mockRes, mockNext);
    expect(mockNext).not.toBeCalled();
    expect(mockRes.redirect).toBeCalledWith('/login');
  });

  it('allow traffic with authed signedCookies', () => {
    const mockRequest = ({ ...getMockRequest(), signedCookies: { authed: 'yes' } } as Partial<Request>) as Request;
    requireAuth()(mockRequest, mockRes, mockNext);
    expect(mockNext).toBeCalled();
  });

  it('allow traffic with and ADMIN_SECRET auth header', () => {
    const mockRequest = getMockRequest();
    mockRequest.headers.authorization = adminSecret;
    requireAuth()(mockRequest, mockRes, mockNext);
    expect(mockNext).toBeCalled();
  });

  it('allow traffic with and SUPPORT_SECRET auth header', () => {
    const mockRequest = getMockRequest();
    mockRequest.headers.authorization = supportSecret;
    requireAuth()(mockRequest, mockRes, mockNext);
    expect(mockNext).toBeCalled();
  });
});
