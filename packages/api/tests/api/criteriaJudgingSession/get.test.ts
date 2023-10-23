import { CriteriaJudgingSession } from '@hangar/database';
import { QueryOrder } from '@mikro-orm/core';
import { createMockRequest } from '../../testUtils/expressHelpers/createMockRequest';
import { createMockResponse } from '../../testUtils/expressHelpers/createMockResponse';
import { get } from '../../../src/api/criteriaJudgingSession/get';

describe('criteriaJudgingSession GET handler', () => {
  it('returns the list of criteriaJudgingSessions from DB', async () => {
    const mockRequest = createMockRequest();
    const mockResponse = createMockResponse();
    const mockCriteriaJudgingSessions = ['cJS1', 'cJS2', 'cJS3'];
    mockRequest.entityManager.find.mockResolvedValueOnce(mockCriteriaJudgingSessions as any);

    await get(mockRequest as any, mockResponse as any);

    expect(mockRequest.entityManager.find).toBeCalledTimes(1);
    expect(mockRequest.entityManager.find).toBeCalledWith(
      CriteriaJudgingSession,
      expect.objectContaining({}),
      expect.objectContaining({ orderBy: { createdAt: QueryOrder.ASC } }),
    );
    expect(mockResponse.send).toBeCalledWith(mockCriteriaJudgingSessions);
  });

  it('should return 500 if something goes wrong', async () => {
    const req = createMockRequest();
    const res = createMockResponse();
    req.entityManager.find.mockRejectedValueOnce(new Error('Oh no there is an error'));

    await get(req as any, res as any);

    expect(req.entityManager.find).toBeCalled();
    expect(res.sendStatus).toHaveBeenCalledWith(500);
  });
});
