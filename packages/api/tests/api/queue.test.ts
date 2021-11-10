import { queue } from '../../src/api/queue';
import { QueueUser } from '../../src/entities/QueueUser';
import { User } from '../../src/entities/User';
import logger from '../../src/logger';
import { testHandler } from '../testUtils/testHandler';

const mockQueueUsers = [
  {
    user: { id: '25' },
  },
  {
    user: { id: '26' },
  },
  {
    user: { id: '27' },
  },
  {
    user: { id: '28' },
  },
];

const user: Partial<User> = { id: '26' };

const loggerSpy = jest.spyOn(logger, 'error').mockImplementation();

describe('/queue', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
  });

  it('successfully returns the position in queue of a given queue type', async () => {
    const handler = testHandler(queue);
    handler.entityManager.find.mockResolvedValueOnce(mockQueueUsers);
    const { body } = await handler
      .get('/Job')
      .send({ user })
      .set({
        'Content-Type': 'application/json',
      })
      .expect(200);
    expect(body).toEqual({ queue: '2', queueRow: mockQueueUsers[1] });
    expect(handler.entityManager.find).toHaveBeenCalledWith(
      QueueUser,
      { type: 'Job', status: 'Pending' },
      { orderBy: { updatedAt: 'ASC' } },
    );
  });

  it('throws a 400 if the specified queue type does not exist', async () => {
    const handler = testHandler(queue);
    const { text } = await handler.get('/notAQueueType').expect(400);

    expect(text).toEqual('The queue type entered was invalid');
  });

  it('throws a 500 if there is an issue with fetching a list of queue items', async () => {
    const handler = testHandler(queue);
    handler.entityManager.find.mockRejectedValueOnce(new Error('Error has occurred'));
    const { text } = await handler
      .get('/Job')
      .send({ user })
      .set({
        'Content-Type': 'application/json',
      })
      .expect(500);

    expect(text).toEqual('There was an issue fetching a list of users from the user queue');
    expect(loggerSpy).toBeCalledTimes(1);
  });
});
