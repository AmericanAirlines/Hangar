import { CriteriaJudgingSession } from '@hangar/database';
import { get } from '../../../../src/api/criteriaJudgingSession/id/get';
import { createMockRequest } from '../../../testUtils/expressHelpers/createMockRequest';
import { createMockResponse } from '../../../testUtils/expressHelpers/createMockResponse';
import { logger } from '../../../../src/utils/logger';

const loggerErrorSpy = jest.spyOn(logger, 'error');

describe('criteriaJudgingSession/id GET handler', () => {
  it('queries and returns the relevant ejs', async () => {
    const mockId = '123';
    const mockCjs = { id: mockId };
    const mockCriteriaJudgingSessions = [mockCjs];
    const mockJudge = {
      criteriaJudgingSessions: { getItems: jest.fn(() => mockCriteriaJudgingSessions) },
    };
    const req = createMockRequest({ params: { id: mockId }, judge: mockJudge as any });
    req.entityManager.findOne.mockResolvedValueOnce(mockCjs);

    const res = createMockResponse();

    await get(req as any, res as any);

    expect(req.entityManager.findOne).toBeCalledWith(
      CriteriaJudgingSession,
      expect.objectContaining({ id: mockId }),
    );
    expect(req.entityManager.populate).toBeCalledWith(
      mockJudge,
      expect.arrayContaining(['criteriaJudgingSessions']),
      expect.objectContaining({ where: { criteriaJudgingSessions: { id: mockCjs.id } } }),
    );
    expect(res.send).toHaveBeenCalledWith(mockCjs);
  });

  it('returns a 404 status if the ejs cannot be found', async () => {
    const req = createMockRequest();
    const res = createMockResponse();

    await get(req as any, res as any);

    expect(res.sendStatus).toHaveBeenCalledWith(404);
  });

  it('returns a 403 status if judge does not have access', async () => {
    const mockId = '123';
    const mockCriteriaJudgingSessions = [] as any[];
    const mockJudge = {
      criteriaJudgingSessions: { getItems: jest.fn(() => mockCriteriaJudgingSessions) },
    };
    const req = createMockRequest({ params: { id: mockId }, judge: mockJudge as any });
    const mockEjs = {};
    req.entityManager.findOne.mockResolvedValueOnce(mockEjs);

    const res = createMockResponse();

    await get(req as any, res as any);

    expect(res.sendStatus).toHaveBeenCalledWith(403);
  });

  it('returns a 500 if something goes wrong', async () => {
    const req = createMockRequest();
    req.entityManager.findOne.mockRejectedValueOnce('An error occurred');
    const res = createMockResponse();

    await get(req as any, res as any);

    expect(res.sendStatus).toHaveBeenCalledWith(500);
    expect(loggerErrorSpy).toHaveBeenCalled();
  });
});
