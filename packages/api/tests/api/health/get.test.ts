import { Request, Response } from 'express';
import { get } from '../../../src/api/health/get';
import { getMockRequest } from '../../testUtils/getMockRequest';
import { getMockResponse } from '../../testUtils/getMockResponse';
import { getMockEntityManager } from '../../testUtils/getMockEntityManager';

describe('health GET', () => {
  it('checks the DB connection and returns an appropriate status for happy path', async () => {
    const mockReq = getMockRequest();
    const mockRes = getMockResponse();

    await get(mockReq as unknown as Request, mockRes as unknown as Response);
    expect(mockRes.status).toBeCalledWith(200);
    expect(mockRes.send).toBeCalledWith(expect.objectContaining({ ok: true, db: true }));
  });

  it('checks the DB connection and returns an appropriate status for unhappy path', async () => {
    const entityManager = getMockEntityManager({
      getConnection: jest.fn().mockReturnValue({ isConnected: jest.fn().mockReturnValue(false) }),
    });
    const mockReq = getMockRequest({ entityManager });
    const mockRes = getMockResponse();

    await get(mockReq as unknown as Request, mockRes as unknown as Response);
    expect(mockRes.status).toBeCalledWith(503);
    expect(mockRes.send).toBeCalledWith(expect.objectContaining({ ok: false, db: false }));
  });
});
