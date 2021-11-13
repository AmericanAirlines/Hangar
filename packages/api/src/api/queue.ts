import { Router } from 'express';
import logger from '../logger';
import { QueueUser, QueueType, QueueStatus } from '../entities/QueueUser';
import { populateUser } from '../middleware/populateUser';
import { messageUsers } from './discord';

export const queue = Router();
queue.use(populateUser());

queue.get('/:type', async (req, res) => {
  const { type } = req.params;

  if (!(type in QueueType)) {
    res.status(400).send('The queue type entered was invalid');
    return;
  }
  try {
    const queueList = await req.entityManager.find(
      QueueUser,
      {
        status: { $in: ['Pending', 'InProgress'] },
        type,
      },
      { orderBy: { createdAt: 'ASC' } },
    );
    res.send(queueList.map((queueItem) => queueItem.toSafeJSON(req, false)));
  } catch (err) {
    const errorMsg = 'There was an issue fetching a list of users from the queue';
    logger.error(`${errorMsg}: `, err);
    res.status(500).send(errorMsg);
  }
});

queue.post('/', async (req, res) => {
  const user = req.userEntity;
  const { type } = req.body;

  if (!(type in QueueType)) {
    res.status(400).send('The queue type entered is invalid');
    return;
  }

  try {
    const userAlreadyInQueue = await req.entityManager
      .count(QueueUser, {
        user,
        status: { $in: ['Pending', 'InProgress'] },
      })
      .then((count) => !!count);
    if (userAlreadyInQueue) {
      res.status(409).send('It appears that you are already waiting in a queue!');
      return;
    }
  } catch (err) {
    const errorMsg = 'There was an issue with checking if the user is already in a queue';
    logger.error(`${errorMsg}: `, err);
    res.status(500).send(errorMsg);
    return;
  }

  try {
    const newQueueUser = new QueueUser({ user: user.toReference(), type });
    await req.entityManager.persistAndFlush(newQueueUser);
    res.send(200);
  } catch (err) {
    const errorMsg = 'There was an issue adding a user to a queue';
    logger.error(`${errorMsg}: `, err);
    res.status(500).send(errorMsg);
  }
});

queue.put('/:id', async (req, res) => {
  const user = req.userEntity;
  const { id } = req.params;
  const { status } = req.body;
  if (!user.isAdmin) {
    res.sendStatus(403);
    return;
  }

  try {
    const queueItemToChange = await req.entityManager.findOne(QueueUser, { id });

    if (!queueItemToChange) {
      res.sendStatus(404);
      return;
    }

    if (queueItemToChange.status === QueueStatus.Pending && status === QueueStatus.InProgress) {
      queueItemToChange.assignee = user.toReference();
      const message = `${user.name} is ready to assist you! Please make your way to the American Airlines booth and ask to see ${user.name}.`;
      await messageUsers(queueItemToChange.user.id, message);
    }

    queueItemToChange.status = status;

    await req.entityManager.flush();
    res.sendStatus(200);
  } catch (err) {
    const errorMsg = 'There was an issue popping a user off of the queue';
    logger.error(`${errorMsg}: `, err);
    res.status(500).send(errorMsg);
  }
});
