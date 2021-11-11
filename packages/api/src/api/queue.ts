import { Router } from 'express';
import logger from '../logger';
import { QueueUser, QueueType } from '../entities/QueueUser';

export const queue = Router();

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
        status: { $in: ['Pending', 'InProgress'], },
        type
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
