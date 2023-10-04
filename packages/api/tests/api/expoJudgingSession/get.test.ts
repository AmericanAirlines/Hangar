import { ExpoJudgingSession } from '@hangar/database';
import { QueryOrder } from '@mikro-orm/core';
import { createMockRequest } from '../../testUtils/expressHelpers/createMockRequest';
import { createMockResponse } from '../../testUtils/expressHelpers/createMockResponse';
import { get } from '../../../src/api/expoJudgingSession/get';

describe('expoJudgingSession GET handler', () => {
  it('returns the list of expoJudgingSessions from DB', async () => {
    const mockRequest = createMockRequest();
    const mockResponse = createMockResponse();
    const mockExpoJudgingSessions = ['eJS1', 'eJS2', 'eJS3'];
    mockRequest.entityManager.find.mockResolvedValueOnce(mockExpoJudgingSessions as any);

    await get(mockRequest as any, mockResponse as any);

    expect(mockRequest.entityManager.find).toBeCalledTimes(1);
    expect(mockRequest.entityManager.find).toBeCalledWith(
      ExpoJudgingSession,
      expect.objectContaining({}),
      expect.objectContaining({ orderBy: { createdAt: QueryOrder.ASC } }),
    );
    expect(mockResponse.send).toBeCalledWith(mockExpoJudgingSessions);
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
