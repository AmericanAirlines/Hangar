import { Request, Response } from 'express';
import { createMockNext } from '../testUtils/expressHelpers/createMockNext';
import { adminMiddleware } from '../../src/middleware/adminMiddleware';
import { getMock } from '../testUtils/getMock';
import { createMockRequest } from '../testUtils/expressHelpers/createMockRequest';
import { createMockResponse } from '../testUtils/expressHelpers/createMockResponse';
import { createMockEntityManager } from '../testUtils/createMockEntityManager';

jest.mock('../../src/middleware/adminMiddleware', () => ({
  adminMiddleware: createMockNext(),
}));

const adminMiddlewareMock = getMock(adminMiddleware);

describe('check if user is the Admin', () => {
  it('user is the Admin', async () => {
    const mockUser = { user: '1' };
    const entityManager = createMockEntityManager({
      findOne: jest.fn().mockResolvedValueOnce(mockUser),
    });
    const req = createMockRequest({ user: { user: '1' }, entityManager });
    const mockRes = createMockResponse();
    const mockNext = jest.fn();

    await adminMiddleware(req as unknown as Request, mockRes as unknown as Response, mockNext);
    expect(adminMiddlewareMock).toBeCalledTimes(1);
    expect(mockRes.sendStatus).toHaveBeenCalledWith(200);
    expect(mockNext).toHaveBeenCalled();
  });

  it('sends a 403 status when user is not the admin', async () => {
    const req = createMockRequest();
    const mockNext = jest.fn();
    const mockRes = createMockResponse();

    await adminMiddleware(req as unknown as Request, mockRes as unknown as Response, mockNext);
    expect(adminMiddlewareMock).toBeCalledTimes(1);
    expect(mockRes.sendStatus).toHaveBeenCalledWith(403);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('sends a 500 status when an error occurs', async () => {
    const req = createMockRequest({ User: { id: '1' } });
    req.entityManager.findOne = jest.fn(() => {
      throw new Error('test error');
    });
    const mockNext = jest.fn();
    const mockRes = createMockResponse();

    await adminMiddleware(req as unknown as Request, mockRes as unknown as Response, mockNext);
    expect(adminMiddlewareMock).toBeCalledTimes(1);
    expect(mockRes.sendStatus).toHaveBeenCalledWith(500);
    expect(mockNext).not.toHaveBeenCalled();
  });
});
