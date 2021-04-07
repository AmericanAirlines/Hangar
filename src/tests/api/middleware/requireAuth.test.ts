import 'jest';
import { Request, Response, NextFunction } from 'express';
import logger from '../../../logger';
import { requireAuth } from '../../../api/middleware/requireAuth';
import { Config } from '../../../entities/config';

const adminSecret = 'this is admin secret';
const supportSecret = 'this is support secret';

jest.mock('../../../entities/config', () => ({
  Config: {
    findOne: jest.fn((key: string) => {
      if (key === 'adminSecret') {
        return { value: adminSecret };
      }
      if (key === 'supportSecret') {
        return { value: supportSecret };
      }
      return undefined;
    }),
  },
}));

jest.spyOn(logger, 'error').mockImplementation();

const getMockRequest = (authorization?: string): Request =>
  // eslint-disable-next-line implicit-arrow-linebreak
  (({
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

  it('sends 401 status when a secret is missing in database', async () => {
    (Config.findOne as jest.Mock).mockResolvedValueOnce(undefined);
    (Config.findOne as jest.Mock).mockResolvedValueOnce(undefined);
    const mockRequest = getMockRequest(supportSecret);
    await requireAuth()(mockRequest, mockRes, mockNext);
    expect(mockRes.sendStatus).toBeCalled();
  });
});
