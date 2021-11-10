import { Router } from 'express';
import logger from '../logger';
import { QueueUser, QueueType } from '../entities/QueueUser';

export const queue = Router();

queue.get('/:type', async (req, res) => {
  const { type } = req.params;
  const { user } = req.body;

  if (!(type in QueueType)) {
    res.status(400).send('The queue type entered was invalid');
    return;
  }

  try {
    const queueList = await req.entityManager.find(
      QueueUser,
      { type, status: 'Pending' },
      { orderBy: { updatedAt: 'ASC' } },
    );
    const queueUser = queueList.filter((queueItem) => queueItem.user.id.includes(user.id));
    const queuePosition = (queueList.indexOf(queueUser[0]) + 1).toString();
    res.send({ queue: queuePosition, queueRow: queueUser[0] });
  } catch (err) {
    const errorMsg = 'There was an issue fetching a list of users from the user queue';
    logger.error(`${errorMsg}: `, err);
    res.status(500).send(errorMsg);
  }
});
