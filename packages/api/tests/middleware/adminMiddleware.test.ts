import { Request, Response } from 'express';
import { adminMiddleware } from '../../src/middleware/adminMiddleware';
import { createMockRequest } from '../testUtils/expressHelpers/createMockRequest';
import { createMockResponse } from '../testUtils/expressHelpers/createMockResponse';
import { createMockEntityManager } from '../testUtils/createMockEntityManager';

describe('Admin Middleware', () => {
  it('validates that user is an Admin', async () => {
    const mockUser = { id: '1' };
    const mockSession = { id: '2' }; // This ID is different for the purpose of test validity
    const entityManager = createMockEntityManager({
      findOne: jest.fn().mockResolvedValueOnce(mockUser),
    });
    const req = createMockRequest({ session: mockSession as any, entityManager });
    const mockRes = createMockResponse();
    const mockNext = jest.fn();

    await adminMiddleware(req as unknown as Request, mockRes as unknown as Response, mockNext);
    expect(entityManager.findOne).toBeCalledTimes(1);
    expect(entityManager.findOne).toBeCalledWith(
      expect.anything(),
      expect.objectContaining({ user: mockSession.id }),
    );
    expect(mockRes.sendStatus).not.toHaveBeenCalled();
    expect(mockNext).toHaveBeenCalled();
  });

  it('sends a 403 status when user is not the admin', async () => {
    const req = createMockRequest();
    const mockNext = jest.fn();
    const mockRes = createMockResponse();

    await adminMiddleware(req as unknown as Request, mockRes as unknown as Response, mockNext);
    expect(mockRes.sendStatus).toHaveBeenCalledWith(403);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('sends a 500 status when an error occurs', async () => {
    const req = createMockRequest({ user: { id: '1' } as any });
    req.entityManager.findOne = jest.fn().mockRejectedValueOnce(new Error('uh oh'));
    const mockNext = jest.fn();
    const mockRes = createMockResponse();

    await adminMiddleware(req as unknown as Request, mockRes as unknown as Response, mockNext);
    expect(mockRes.sendStatus).toHaveBeenCalledWith(500);
    expect(mockNext).not.toHaveBeenCalled();
  });
});
