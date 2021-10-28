import { QueryOrder } from '@mikro-orm/core';
import { events } from '../../src/api/events';
import { Event } from '../../src/entities/Event';
import logger from '../../src/logger';
import { testHandler } from '../testUtils/testHandler';

const mockEvents: Partial<Event>[] = [
  {
    name: 'Event 1',
    start: new Date(),
    end: new Date(),
    description: 'the first event',
  },
  {
    name: 'Event 2',
    start: new Date(),
    end: new Date(),
    description: 'the second event',
  },
];

const loggerSpy = jest.spyOn(logger, 'error').mockImplementation();

describe('/events', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
  });

  it('successfully returns all events', async () => {
    const handler = testHandler(events);
    handler.entityManager.find.mockResolvedValueOnce(mockEvents);

    const { body } = await handler.get('/').expect(200);

    expect(body).toEqual(mockEvents);
    expect(handler.entityManager.find).toHaveBeenCalledWith(
      Event,
      {},
      {},
      { start: QueryOrder.ASC },
    );
  });

  it('returns 500 error when the db request fails', async () => {
    const handler = testHandler(events);
    handler.entityManager.find.mockRejectedValueOnce(new Error('Error has occurred'));

    const { text } = await handler.get('/').expect(500);
    expect(text).toEqual('There was an issue getting events');

    expect(loggerSpy).toBeCalledTimes(1);
  });
});
