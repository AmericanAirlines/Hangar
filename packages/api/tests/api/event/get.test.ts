import { Event } from '@hangar/database';
import { QueryOrder } from '@mikro-orm/core';
import { createMockRequest } from '../../testUtils/expressHelpers/createMockRequest';
import { createMockResponse } from '../../testUtils/expressHelpers/createMockResponse';
import { get } from '../../../src/api/event/get';

// import { event } from '../../../src/api/event';

describe('event GET handler', () => {
  it('returns the list of event from DB', async () => {
    const mockRequest = createMockRequest();
    const mockResponse = createMockResponse();
    const mockEvents = ['events'];
    mockRequest.entityManager.find.mockResolvedValueOnce(mockEvents as any);

    await get(mockRequest as any, mockResponse as any);

    expect(mockRequest.entityManager.find).toBeCalledTimes(1);
    expect(mockRequest.entityManager.find).toBeCalledWith(
      Event,
      expect.objectContaining({}),
      expect.objectContaining({ orderBy: { start: QueryOrder.ASC } }),
    );
    expect(mockResponse.send).toBeCalledWith(mockEvents);
  });
});
