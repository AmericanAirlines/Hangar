import { CriteriaJudgingSession } from '@hangar/database';
import { criteriaJudgingSessionMiddleware } from '../../src/middleware/criteriaJudgingSessionMiddleware';
import { createMockRequest } from '../testUtils/expressHelpers/createMockRequest';
import { createMockResponse } from '../testUtils/expressHelpers/createMockResponse';

describe('criteriaJudgingSessionMiddleware', () => {
  it('calls the next method when a matching criteria judging session is found for the judge', async () => {
    const mockId = '123';
    const mockJudge = { criteriaJudgingSessions: { getItems: jest.fn(() => [{ id: mockId }]) } };
    const req = createMockRequest({ judge: mockJudge as any, params: { id: mockId } });
    const res = createMockResponse();
    const next = jest.fn();

    req.entityManager.findOne.mockResolvedValueOnce({ id: mockId } as any);

    await criteriaJudgingSessionMiddleware(req as any, res as any, next as any);

    expect(req.entityManager.findOne).toBeCalledWith(CriteriaJudgingSession, { id: mockId });
    expect(req.entityManager.populate).toBeCalledTimes(1);
    expect(req.entityManager.populate).toBeCalledWith(
      mockJudge,
      expect.arrayContaining(['criteriaJudgingSessions']),
      expect.objectContaining({ where: { criteriaJudgingSessions: { id: mockId } } }),
    );

    expect(res.sendStatus).not.toHaveBeenCalled();
    expect(next).toBeCalled();
  });

  it('returns a 404 status if the judging session cannot be found', async () => {
    const mockId = '123';
    const req = createMockRequest({ params: { id: mockId } });
    const res = createMockResponse();
    const next = jest.fn();

    await criteriaJudgingSessionMiddleware(req as any, res as any, next as any);

    expect(res.sendStatus).toHaveBeenCalledWith(404);
    expect(next).not.toBeCalled();
  });

  it('returns a 404 status if the id is not part of the path', async () => {
    const req = createMockRequest();
    const res = createMockResponse();
    const next = jest.fn();

    await criteriaJudgingSessionMiddleware(req as any, res as any, next as any);

    expect(res.sendStatus).toHaveBeenCalledWith(404);
    expect(next).not.toBeCalled();
  });

  it('returns a 403 status if judge does not have access', async () => {
    const next = jest.fn();
    const mockId = '123';
    const mockCriteriaJudgingSessions = [] as any[];
    const mockJudge = {
      criteriaJudgingSessions: { getItems: jest.fn(() => mockCriteriaJudgingSessions) },
    };
    const req = createMockRequest({ params: { id: mockId }, judge: mockJudge as any });
    const mockJudgingSession = {};
    req.entityManager.findOne.mockResolvedValueOnce(mockJudgingSession);

    const res = createMockResponse();

    await criteriaJudgingSessionMiddleware(req as any, res as any, next as any);

    expect(res.sendStatus).toHaveBeenCalledWith(403);
    expect(next).not.toBeCalled();
  });

  it('returns a 500 status if something goes wrong', async () => {
    const req = createMockRequest({ params: { id: '123' } });
    const res = createMockResponse();
    const next = jest.fn();

    req.entityManager.findOne.mockRejectedValueOnce('Nope!');

    await criteriaJudgingSessionMiddleware(req as any, res as any, next as any);

    expect(next).not.toBeCalled();
    expect(res.sendStatus).toBeCalledWith(500);
  });
});
