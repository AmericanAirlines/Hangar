import { judgeMiddleware } from '../../src/middleware/judgeMiddleware';
import { createMockRequest } from '../testUtils/expressHelpers/createMockRequest';
import { createMockResponse } from '../testUtils/expressHelpers/createMockResponse';

describe('Judge Middleware', () => {
  it('validates that the user registered as a Judge', async () => {
    const mockUser = { id: '1' };
    const mockSession = { id: '2' };
    const mockReq = createMockRequest({ session: mockSession as any });
    const { entityManager } = mockReq;
    entityManager.findOne.mockResolvedValueOnce(mockUser);
    const mockRes = createMockResponse();
    const mockNext = jest.fn();

    await judgeMiddleware(mockReq as any, mockRes as any, mockNext);
    expect(entityManager.findOne).toBeCalledTimes(1);
    expect(entityManager.findOne).toBeCalledWith(
      expect.anything(),
      expect.objectContaining({ user: mockSession.id }),
    );
    expect(mockRes.sendStatus).not.toHaveBeenCalled();
    expect(mockNext).toHaveBeenCalled();
  });

  it('sends a 403 status when user is a Judge', async () => {
    const mockReq = createMockRequest();
    const mockRes = createMockResponse();
    const mockNext = jest.fn();

    await judgeMiddleware(mockReq as any, mockRes as any, mockNext);
    expect(mockRes.sendStatus).toHaveBeenCalledWith(403);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('sends a 500 status when an error occurs', async () => {
    const mockReq = createMockRequest({ user: { id: '1' } as any });
    mockReq.entityManager.findOne = jest.fn().mockRejectedValueOnce(new Error('uh oh'));
    const mockRes = createMockResponse();
    const mockNext = jest.fn();

    await judgeMiddleware(mockReq as any, mockRes as any, mockNext);
    expect(mockRes.sendStatus).toHaveBeenCalledWith(500);
    expect(mockNext).not.toHaveBeenCalled();
  });
});
