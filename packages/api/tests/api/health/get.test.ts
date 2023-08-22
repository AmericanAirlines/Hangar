import { Request, Response } from 'express';
import { get } from '../../../src/api/health/get';
import { createMockRequest } from '../../testUtils/expressHelpers/createMockRequest';
import { createMockResponse } from '../../testUtils/expressHelpers/createMockResponse';
import { createMockEntityManager } from '../../testUtils/createMockEntityManager';

describe('health GET', () => {
  it('checks the DB connection and returns an appropriate status for happy path', async () => {
    const mockReq = createMockRequest();
    const mockRes = createMockResponse();

    await get(mockReq as unknown as Request, mockRes as unknown as Response);
    expect(mockRes.status).toBeCalledWith(200);
    expect(mockRes.send).toBeCalledWith(expect.objectContaining({ ok: true, db: true }));
  });

  it('checks the DB connection and returns an appropriate status for unhappy path', async () => {
    const entityManager = createMockEntityManager({
      getConnection: jest.fn().mockReturnValue({ isConnected: jest.fn().mockReturnValue(false) }),
    });
    const mockReq = createMockRequest({ entityManager });
    const mockRes = createMockResponse();

    await get(mockReq as unknown as Request, mockRes as unknown as Response);
    expect(mockRes.status).toBeCalledWith(503);
    expect(mockRes.send).toBeCalledWith(expect.objectContaining({ ok: false, db: false }));
  });
});
