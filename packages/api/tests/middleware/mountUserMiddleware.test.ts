import { Request, Response } from 'express';
import { mountUserMiddleware } from '../../src/middleware/mountUserMiddleware';
import { createMockReq, createMockRes } from '../testUtils/mockUserData';

describe('mounting user on /user', () => {
  it('adds a user to the request', async () => {
    // setup
    const req = {
      ...createMockReq(),
      session: { id: '1' },
    };
    const mockNext = jest.fn();
    const mockRes = createMockRes();

    // test
    await mountUserMiddleware(req as unknown as Request, mockRes as unknown as Response, mockNext);

    // assert
    expect(req.user).toBeDefined();
    expect(mockNext).toHaveBeenCalled();
  });

  it('sends a 403 status when a session id is not found', async () => {
    // setup
    const req = {
      ...createMockReq(),
      session: undefined,
    };
    const mockNext = jest.fn();
    const mockRes = createMockRes();

    // test
    await mountUserMiddleware(req as unknown as Request, mockRes as unknown as Response, mockNext);

    // assert
    expect(mockRes.sendStatus).toHaveBeenCalledWith(403);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('sends a 500 status when an error occurs', async () => {
    // setup
    const req = {
      ...createMockReq(),
      session: { id: '1' },
    };
    req.entityManager.findOne = jest.fn(() => {
      throw new Error('test error');
    });
    const mockNext = jest.fn();
    const mockRes = createMockRes();

    // test
    await mountUserMiddleware(req as unknown as Request, mockRes as unknown as Response, mockNext);

    // assert
    expect(mockRes.sendStatus).toHaveBeenCalledWith(500);
    expect(mockNext).not.toHaveBeenCalled();
  });
});
