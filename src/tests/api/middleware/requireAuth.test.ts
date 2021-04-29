import 'jest';
import { Request, Response, NextFunction } from 'express';
import logger from '../../../logger';
import { requireAuth } from '../../../api/middleware/requireAuth';
import { Config } from '../../../entities/config';
import { getActivePlatform } from '../../../common';

const adminSecret = 'this is admin secret';
const supportSecret = 'this is support secret';

jest.mock('../../../entities/config', () => ({
  Config: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getValueAs: jest.fn((key: string) => (({ adminSecret, supportSecret } as any)[key] as string)),
  },
}));

const getActivePlatformMock = getActivePlatform as jest.MockedFunction<typeof getActivePlatform>;
jest.mock('../../../common', () => ({
  getActivePlatform: jest.fn().mockResolvedValue(jest.requireActual('../../../common').SupportedPlatform.slack),
}));

jest.spyOn(logger, 'error').mockImplementation();

const getMockRequest = (authorization?: string, url?: string): Request =>
  // eslint-disable-next-line implicit-arrow-linebreak
  (({
    path: url,
    headers: {
      authorization: authorization ?? "AH AH AH... YOU DIDN'T SAY THE MAGIC WORD!",
    },
  } as Partial<Request>) as Request);

const mockRes = ({
  redirect: jest.fn(),
  sendStatus: jest.fn(),
} as Partial<Response>) as Response;

const mockNext: NextFunction = jest.fn();

describe('requireAuth middleware', () => {
  beforeEach(() => {
    // jest.resetModules();
    jest.clearAllMocks();
  });

  it('rejects unauthorized traffic', async () => {
    const mockRequest = getMockRequest();
    await requireAuth()(mockRequest, mockRes, mockNext);
    expect(mockNext).not.toBeCalled();
    expect(mockRes.sendStatus).toBeCalledWith(401);
    expect(logger.error).toBeCalled();
  });

  it('redirects unauthorized traffic if needed', async () => {
    const mockRequest = getMockRequest();
    const redirect = true;
    await requireAuth(redirect)(mockRequest, mockRes, mockNext);
    expect(mockNext).not.toBeCalled();
    expect(mockRes.redirect).toBeCalledWith('/login');
  });

  it('allow traffic with authed signedCookies', async () => {
    const mockRequest = ({ ...getMockRequest(), signedCookies: { authed: 'yes' } } as Partial<Request>) as Request;
    await requireAuth()(mockRequest, mockRes, mockNext);
    expect(mockNext).toBeCalled();
  });

  it('allow traffic with and ADMIN_SECRET auth header', async () => {
    const mockRequest = getMockRequest(adminSecret);
    await requireAuth()(mockRequest, mockRes, mockNext);
    expect(mockNext).toBeCalled();
  });

  it('allow traffic with and SUPPORT_SECRET auth header', async () => {
    const mockRequest = getMockRequest(supportSecret);
    await requireAuth()(mockRequest, mockRes, mockNext);
    expect(mockNext).toBeCalled();
  });

  it('calls next status when a secret is missing in database but url is /setup', async () => {
    (Config.getValueAs as jest.Mock).mockResolvedValueOnce(undefined);
    (Config.getValueAs as jest.Mock).mockResolvedValueOnce(undefined);
    const mockRequest = getMockRequest(supportSecret, '/setup');
    await requireAuth()(mockRequest, mockRes, mockNext);
    expect(mockNext).toBeCalled();
  });

  it('redirect to root when the app is setup and the url is /setup', async () => {
    const mockRequest = getMockRequest(supportSecret, '/setup');
    await requireAuth()(mockRequest, mockRes, mockNext);
    expect(mockRes.redirect).toHaveBeenCalledWith('/');
  });

  it('calls next status when app is not setup and url is /api/config/bulk', async () => {
    getActivePlatformMock.mockResolvedValueOnce(null);
    const mockRequest = getMockRequest(supportSecret, '/api/config/bulk');
    await requireAuth()(mockRequest, mockRes, mockNext);
    expect(mockNext).toBeCalled();
  });
  it('redirects to /setup when app is not setup', async () => {
    getActivePlatformMock.mockResolvedValueOnce(null);
    const mockRequest = getMockRequest(supportSecret, '/something');
    await requireAuth()(mockRequest, mockRes, mockNext);
    expect(mockRes.redirect).toHaveBeenCalledWith('/setup');
  });
});
