import { QueryOrder } from '@mikro-orm/core';
import { events } from '../../src/api/events';
import { Event } from '../../src/entities/Event';
import logger from '../../src/logger';
import { testHandler } from '../testUtils/testHandler';

interface MockEvent {
  name: string;
  start: Date;
  end: Date;
  description?: string;
}

const mockEvents: MockEvent[] = [
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

    expect(body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          description: 'the first event',
          name: 'Event 1',
          start: mockEvents[0].start.toISOString(),
          end: mockEvents[0].end.toISOString(),
        }),
        expect.objectContaining({
          description: 'the second event',
          name: 'Event 2',
          start: mockEvents[1].start.toISOString(),
          end: mockEvents[1].end.toISOString(),
        }),
      ]),
    );
    expect(handler.entityManager.find).toHaveBeenCalledWith(
      Event,
      {},
      {},
      { start: QueryOrder.ASC },
    );
  });

  it('non-existant events returns 404', async () => {
    const handler = testHandler(events);
    handler.entityManager.find.mockResolvedValueOnce([]);

    await handler.get('/').expect(404);
  });

  it('returns 500 error', async () => {
    const handler = testHandler(events);
    handler.entityManager.find.mockRejectedValueOnce(new Error('Error has occurred'));

    const { text } = await handler.get('/').expect(500);
    expect(text).toEqual('There was an issue getting events');

    expect(loggerSpy).toBeCalledTimes(1);
  });
});
