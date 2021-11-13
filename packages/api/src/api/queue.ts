import { Router } from 'express';
import logger from '../logger';
import { QueueUser, QueueType } from '../entities/QueueUser';
import { populateUser } from '../middleware/populateUser';

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

queue.post('/join', async (req, res) => {
  const user = req.userEntity;
  const { type } = req.body;

  if (!(type in QueueType)) {
    res.status(400).send('The queue type entered is invalid');
    return;
  }

  try {
    const currentQueueItems = await req.entityManager.find(QueueUser, {
      user,
      status: { $in: ['Pending', 'InProgress'] },
    });
    if (currentQueueItems.length !== 0) {
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
