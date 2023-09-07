import { Prize } from '@hangar/database';
import { QueryOrder } from '@mikro-orm/core';
import { createMockRequest } from '../../testUtils/expressHelpers/createMockRequest';
import { createMockResponse } from '../../testUtils/expressHelpers/createMockResponse';
import { get } from '../../../src/api/prize/get';

describe('prize GET handler', () => {
  it('returns the list of prize from DB', async () => {
    const mockRequest = createMockRequest();
    const mockResponse = createMockResponse();
    const mockPrizes = ['prizes'];
    mockRequest.entityManager.find.mockResolvedValueOnce(mockPrizes as any);

    await get(mockRequest as any, mockResponse as any);

    expect(mockRequest.entityManager.find).toBeCalledTimes(1);
    expect(mockRequest.entityManager.find).toBeCalledWith(
      Prize,
      expect.objectContaining({}),
      expect.objectContaining({ orderBy: { position: QueryOrder.DESC } }),
    );
    expect(mockResponse.send).toBeCalledWith(mockPrizes);
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
