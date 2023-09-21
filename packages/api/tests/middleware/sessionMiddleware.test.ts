import { sessionMiddleware } from '../../src/middleware/sessionMiddleware';
import { createMockRequest } from '../testUtils/expressHelpers/createMockRequest';
import { createMockResponse } from '../testUtils/expressHelpers/createMockResponse';

describe('', () => {
  it('calls next when a valid session is found', async () => {
    await jest.isolateModulesAsync(async () => {
      const mockReq = createMockRequest({ session: { id: '1' } });
      const mockRes = createMockResponse();
      const mockNext = jest.fn();
      sessionMiddleware(mockReq as any, mockRes as any, mockNext);

      expect(mockNext).toBeCalledTimes(1);
    });
  });

  it('returns a 401 when a valid session cannot be found', async () => {
    const mockReq = createMockRequest();
    const mockRes = createMockResponse();
    const mockNext = jest.fn();
    sessionMiddleware(mockReq as any, mockRes as any, mockNext);

    expect(mockRes.sendStatus).toBeCalledTimes(1);
    expect(mockRes.sendStatus).toBeCalledWith(401);
  });

  it('returns a 401 when a an email is not included in the session', async () => {
    const mockReq = createMockRequest();
    const mockRes = createMockResponse();
    const mockNext = jest.fn();
    sessionMiddleware(mockReq as any, mockRes as any, mockNext);

    expect(mockRes.sendStatus).toBeCalledTimes(1);
    expect(mockRes.sendStatus).toBeCalledWith(401);
  });
});
