import { Request, Response } from 'express';
import { createMockNext } from '../testUtils/expressHelpers/createMockNext';
import { mountUserMiddleware } from '../../src/middleware/mountUserMiddleware';
import { getMock } from '../testUtils/getMock';
import { sessionMiddleware } from '../../src/middleware/sessionMiddleware';
import { createMockRequest } from '../testUtils/expressHelpers/createMockRequest';
import { createMockResponse } from '../testUtils/expressHelpers/createMockResponse';
import { createMockEntityManager } from '../testUtils/createMockEntityManager';

jest.mock('../../src/middleware/sessionMiddleware', () => ({
  sessionMiddleware: createMockNext(),
}));

const sessionMiddlewareMock = getMock(sessionMiddleware);

describe('mounting user on /user', () => {
  it('adds a user to the request', async () => {
    const mockUser = { id: '1' };
    const entityManager = createMockEntityManager({
      findOne: jest.fn().mockResolvedValueOnce(mockUser),
    });
    const req = createMockRequest({ session: { id: '1' }, entityManager });
    const mockRes = createMockResponse();
    const mockNext = jest.fn();

    await mountUserMiddleware(req as unknown as Request, mockRes as unknown as Response, mockNext);

    expect(sessionMiddlewareMock).toBeCalledTimes(1);
    expect(req.user).toBe(mockUser);
    expect(mockNext).toHaveBeenCalled();
  });

  it('sends a 403 status when a session id is not found', async () => {
    const req = createMockRequest();
    const mockNext = jest.fn();
    const mockRes = createMockResponse();

    await mountUserMiddleware(req as unknown as Request, mockRes as unknown as Response, mockNext);

    expect(sessionMiddlewareMock).toBeCalledTimes(1);
    expect(mockRes.sendStatus).toHaveBeenCalledWith(403);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('sends a 500 status when an error occurs', async () => {
    const req = createMockRequest({ session: { id: '1' } });
    req.entityManager.findOne = jest.fn(() => {
      throw new Error('test error');
    });
    const mockNext = jest.fn();
    const mockRes = createMockResponse();

    await mountUserMiddleware(req as unknown as Request, mockRes as unknown as Response, mockNext);

    expect(sessionMiddlewareMock).toBeCalledTimes(1);
    expect(mockRes.sendStatus).toHaveBeenCalledWith(500);
    expect(mockNext).not.toHaveBeenCalled();
  });
});
