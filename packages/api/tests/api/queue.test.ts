import { Handler } from 'express';
import { queue } from '../../src/api/queue';
import { QueueStatus, QueueUser } from '../../src/entities/QueueUser';
import { User } from '../../src/entities/User';
import logger from '../../src/logger';
import { testHandler } from '../testUtils/testHandler';
import { messageUsers } from '../../src/api/discord';

const mockReturnUsers = [
  {
    user: { id: '25' },
  },
  {
    user: { id: '26' },
  },
];

const mockQueueUsers = [
  {
    user: { id: '25' },
    id: '1',
    assignee: null,
    status: QueueStatus.Pending,
    toSafeJSON: jest.fn().mockReturnValue(mockReturnUsers[0]),
  },
  {
    user: { id: '26' },
    id: '2',
    status: QueueStatus.Abandoned,
    toSafeJSON: jest.fn().mockReturnValue(mockReturnUsers[1]),
  },
];

jest.mock('../../src/api/discord', () => ({
  messageUsers: jest.fn(),
}));

const loggerSpy = jest.spyOn(logger, 'error').mockImplementation();

const mockQueueModerator = {
  id: 'mocked',
  isAdmin: true,
  name: 'bob',
  toReference: jest.fn(),
} as unknown as User;

jest.mock('../../src/middleware/populateUser.ts', () => ({
  populateUser: jest.fn(
    (): Handler => (req, _res, next) => {
      req.userEntity = mockQueueModerator;
      next();
    },
  ),
}));

describe('/queue', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    mockQueueUsers[0].status = QueueStatus.Pending;
    delete mockQueueUsers[0].assignee;
    mockQueueUsers[1].status = QueueStatus.Abandoned;
    mockQueueModerator.isAdmin = true;
  });

  it('successfully returns the position in queue of a given queue type', async () => {
    const handler = testHandler(queue);
    handler.entityManager.find.mockResolvedValueOnce(mockQueueUsers);
    const { body } = await handler.get('/Job').expect(200);
    expect(body).toEqual(mockReturnUsers);
    expect(handler.entityManager.find).toHaveBeenCalledWith(
      QueueUser,
      {
        status: { $in: ['Pending', 'InProgress'] },
        type: 'Job',
      },
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
    const { text } = await handler.get('/Job').expect(500);

    expect(text).toEqual('There was an issue fetching a list of users from the queue');
    expect(loggerSpy).toBeCalledTimes(1);
  });

  it('successfully adds a user to a queue given a specific type', async () => {
    const handler = testHandler(queue);
    handler.entityManager.count.mockResolvedValueOnce(0);
    const type = 'Idea';
    await handler.post('/').send({ type }).set({ 'Content-Type': 'application/json' }).expect(200);
  });

  it('will return a 400 if the user enters an invalid queue', async () => {
    const handler = testHandler(queue);
    const type = 'not a real thing';
    const invalidQueueMsg = 'The queue type entered is invalid';
    const { text } = await handler
      .post('/')
      .send({ type })
      .set({ 'Content-Type': 'application/json' })
      .expect(400);
    expect(text).toEqual(invalidQueueMsg);
  });

  it('will return a 409 if the user is already in a queue', async () => {
    const handler = testHandler(queue);
    handler.entityManager.count.mockResolvedValueOnce(1);
    const type = 'Idea';
    const alreadyInQueueMsg = 'It appears that you are already waiting in a queue!';
    const { text } = await handler
      .post('/')
      .send({ type })
      .set({ 'Content-Type': 'application/json' })
      .expect(409);
    expect(text).toEqual(alreadyInQueueMsg);
  });

  it('will return a 500 if there is an issue with checking whether or not the user is already in a queue', async () => {
    const handler = testHandler(queue);
    handler.entityManager.count.mockRejectedValueOnce('err');
    const type = 'Idea';
    const errMsgFind = 'There was an issue with checking if the user is already in a queue';
    const { text } = await handler
      .post('/')
      .send({ type })
      .set({ 'Content-Type': 'application/json' })
      .expect(500);
    expect(text).toEqual(errMsgFind);
  });

  it('will return a 500 if there is an issue with adding a user to the queue', async () => {
    const handler = testHandler(queue);
    handler.entityManager.count.mockResolvedValueOnce(0);
    handler.entityManager.persistAndFlush.mockRejectedValueOnce('err');
    const type = 'Idea';
    const errMsg = 'There was an issue adding a user to a queue';
    const { text } = await handler
      .post('/')
      .send({ type })
      .set({ 'Content-Type': 'application/json' })
      .expect(500);
    expect(text).toEqual(errMsg);
  });

  it('will update a queue item that has the pending status to the inProgress status and then assign a user and message them via Discord', async () => {
    const handler = testHandler(queue);
    handler.entityManager.findOne.mockResolvedValueOnce(mockQueueUsers[0]);
    const status = QueueStatus.InProgress;
    const discordMsg =
      'bob is ready to assist you! Please make your way to the American Airlines booth and ask to see bob.';
    await handler
      .put('/1')
      .send({ status })
      .set({ 'Content-Type': 'application/json' })
      .expect(200);
    expect(handler.entityManager.flush).toBeCalledTimes(1);
    expect(mockQueueUsers[0].status).toEqual(status);
    expect(mockQueueUsers[0].assignee).toEqual(mockQueueModerator.toReference());
    expect(messageUsers as jest.Mock).toBeCalledWith(mockQueueUsers[0].user.id, discordMsg);
  });

  it('will update a queue item that has one status to one that has another status', async () => {
    const handler = testHandler(queue);
    handler.entityManager.findOne.mockResolvedValueOnce(mockQueueUsers[1]);
    const status = QueueStatus.Pending;
    await handler
      .put('/2')
      .send({ status })
      .set({ 'Content-Type': 'application/json' })
      .expect(200);
    expect(handler.entityManager.flush).toBeCalledTimes(1);
    expect(mockQueueUsers[1].status).toEqual(status);
  });

  it('will return a 403 if the user is not an admin', async () => {
    const handler = testHandler(queue);
    mockQueueModerator.isAdmin = false;
    const status = QueueStatus.Pending;
    await handler
      .put('/1')
      .send({ status })
      .set({ 'Content-Type': 'application/json' })
      .expect(403);
    expect(handler.entityManager.findOne).not.toBeCalled();
  });

  it('will return a 404 if the specified queue item does not exist', async () => {
    const handler = testHandler(queue);
    const status = QueueStatus.Pending;
    handler.entityManager.findOne.mockResolvedValueOnce(null);
    await handler
      .put('/88')
      .send({ status })
      .set({ 'Content-Type': 'application/json' })
      .expect(404);
    expect(handler.entityManager.findOne).toBeCalledTimes(1);
    expect(handler.entityManager.flush).not.toBeCalled();
  });

  it('will throw a 500 if there is an issue with fetching a queue item', async () => {
    const handler = testHandler(queue);
    handler.entityManager.findOne.mockRejectedValueOnce('err');
    const status = QueueStatus.Pending;
    const errMsg = 'There was an issue popping a user off of the queue';
    const { text } = await handler
      .put('/2')
      .send({ status })
      .set({ 'Content-Type': 'application/json' })
      .expect(500);
    expect(loggerSpy).toBeCalledTimes(1);
    expect(text).toEqual(errMsg);
  });

  it('will throw a 500 if there is an issue with updating a queue item', async () => {
    const handler = testHandler(queue);
    handler.entityManager.findOne.mockResolvedValueOnce(mockQueueUsers[1]);
    handler.entityManager.flush.mockRejectedValueOnce('err');
    const status = QueueStatus.Pending;
    const errMsg = 'There was an issue popping a user off of the queue';
    const { text } = await handler
      .put('/2')
      .send({ status })
      .set({ 'Content-Type': 'application/json' })
      .expect(500);
    expect(loggerSpy).toBeCalledTimes(1);
    expect(text).toEqual(errMsg);
  });
});
