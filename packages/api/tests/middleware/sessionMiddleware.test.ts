import { sessionMiddleware } from '../../src/middleware/sessionMiddleware';

describe('', () => {
  it('calls next when a valid session is found', async () => {
    await jest.isolateModulesAsync(async () => {
      const mockReq = {
        session: {
          email: 'pancakes@waffles.breakfast',
        },
      };
      const mockRes = {};
      const mockNext = jest.fn();
      sessionMiddleware(mockReq as any, mockRes as any, mockNext);

      expect(mockNext).toBeCalledTimes(1);
    });
  });

  it('returns a 401 when a valid session cannot be found', async () => {
    const mockReq = {};
    const mockRes = { sendStatus: jest.fn() };
    const mockNext = jest.fn();
    sessionMiddleware(mockReq as any, mockRes as any, mockNext);

    expect(mockRes.sendStatus).toBeCalledTimes(1);
    expect(mockRes.sendStatus).toBeCalledWith(401);
  });

  it('returns a 401 when a an email is not included in the session', async () => {
    const mockReq = { session: {} };
    const mockRes = { sendStatus: jest.fn() };
    const mockNext = jest.fn();
    sessionMiddleware(mockReq as any, mockRes as any, mockNext);

    expect(mockRes.sendStatus).toBeCalledTimes(1);
    expect(mockRes.sendStatus).toBeCalledWith(401);
  });
});
