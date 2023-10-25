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
    req.entityManager.findOneOrFail.mockResolvedValueOnce(mockCjs);

    const res = createMockResponse();

    await get(req as any, res as any);

    expect(req.entityManager.findOneOrFail).toBeCalledWith(
      CriteriaJudgingSession,
      expect.objectContaining({ id: mockId }),
    );
    expect(res.send).toHaveBeenCalledWith(mockCjs);
  });

  it('returns a 500 if something goes wrong', async () => {
    const req = createMockRequest();
    req.entityManager.findOneOrFail.mockRejectedValueOnce('An error occurred');
    const res = createMockResponse();

    await get(req as any, res as any);

    expect(res.sendStatus).toHaveBeenCalledWith(500);
    expect(loggerErrorSpy).toHaveBeenCalled();
  });
});
