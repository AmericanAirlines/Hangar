import { queue } from '../../src/api/queue';
import { QueueUser } from '../../src/entities/QueueUser';
import logger from '../../src/logger';
import { testHandler } from '../testUtils/testHandler';

const mockReturnUsers = [
  {
    user: { id: '25' },

  },
  {
    user: { id: '26' },
  }
];

const mockQueueUsers = [
  {
    user: { id: '25' },
    toSafeJSON: jest.fn().mockReturnValue(mockReturnUsers[0]),
  },
  {
    user: { id: '26' },
    toSafeJSON: jest.fn().mockReturnValue(mockReturnUsers[1]),
  }
];


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
      .expect(200);
    expect(body).toEqual(mockReturnUsers);
    expect(handler.entityManager.find).toHaveBeenCalledWith(
      QueueUser,
      { $or: [ { status: { $eq: 'Pending'},}, { status: { $eq: 'InProgress'},}], $and: [{type: 'Job'}]},
      { orderBy: { createdAt: 'ASC' } },
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
      .expect(500);

    expect(text).toEqual('There was an issue fetching a list of users from the queue');
    expect(loggerSpy).toBeCalledTimes(1);
  });
});
