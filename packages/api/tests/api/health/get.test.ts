import { get } from '../../../src/api/health/get';
import { createMockRequest } from '../../testUtils/expressHelpers/createMockRequest';
import { createMockResponse } from '../../testUtils/expressHelpers/createMockResponse';

describe('health GET', () => {
  it('checks the DB connection and returns an appropriate status for happy path', async () => {
    const mockReq = createMockRequest();
    const mockRes = createMockResponse();

    await get(mockReq as any, mockRes as any);
    expect(mockRes.status).toBeCalledWith(200);
    expect(mockRes.send).toBeCalledWith(expect.objectContaining({ ok: true, db: true }));
  });

  it('checks the DB connection and returns an appropriate status for unhappy path', async () => {
    const mockReq = createMockRequest();
    mockReq.entityManager.getConnection.mockReturnValueOnce({
      isConnected: jest.fn().mockReturnValue(false),
    } as any);
    const mockRes = createMockResponse();

    await get(mockReq as any, mockRes as any);
    expect(mockRes.status).toBeCalledWith(503);
    expect(mockRes.send).toBeCalledWith(expect.objectContaining({ ok: false, db: false }));
  });
});
