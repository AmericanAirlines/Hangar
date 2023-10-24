import { expoJudgeAccessMiddleware } from '../../src/middleware/expoJudgeAccessMiddleware';
import { createMockRequest } from '../testUtils/expressHelpers/createMockRequest';
import { createMockResponse } from '../testUtils/expressHelpers/createMockResponse';

describe('expo Judge Access middleware', () => {
  it('validates that the judge as access to a session', async () => {
    const mockId = '123';
    const mockNext = jest.fn();
    const mockEjsCount = 22;
    const mockContextCount = 33;
    const mockJudge = {};
    const req = createMockRequest({ params: { id: mockId }, judge: mockJudge as any });
    req.entityManager.count?.mockResolvedValue(mockEjsCount);
    req.entityManager.count?.mockResolvedValue(mockContextCount);

    const res = createMockResponse();

    await expoJudgeAccessMiddleware(req as any, res as any, mockNext);

    expect(res.sendStatus).toBeCalledWith(204);
    expect(mockNext).toHaveBeenCalled();
  });

  it('returns a 404 status if the ejs cannot be found', async () => {
    const mockId = '123';
    const mockJudge = {};
    const req = createMockRequest({ params: { id: mockId }, judge: mockJudge as any });
    const mockEjsCount = -1;
    req.entityManager.count?.mockResolvedValue(mockEjsCount);
    const res = createMockResponse();
    const mockNext = jest.fn();

    await expoJudgeAccessMiddleware(req as any, res as any, mockNext);

    expect(res.sendStatus).toHaveBeenCalledWith(404);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('return a 403 status if it cant find a record with an ejsId', async () => {
    const mockId = '123';
    const mockJudge = {};
    const req = createMockRequest({ params: { id: mockId }, judge: mockJudge as any });
    const mockContextCount = 0;
    req.entityManager.count?.mockResolvedValue(mockContextCount);
    const res = createMockResponse();
    const mockNext = jest.fn();

    await expoJudgeAccessMiddleware(req as any, res as any, mockNext);

    expect(res.sendStatus).toHaveBeenCalledWith(403);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('returns a 500 if something goes wrong', async () => {
    const req = createMockRequest();
    req.entityManager.count.mockRejectedValueOnce('An error occurred');
    const res = createMockResponse();
    const mockNext = jest.fn();

    await expoJudgeAccessMiddleware(req as any, res as any, mockNext);

    expect(res.sendStatus).toHaveBeenCalledWith(500);
  });
});
