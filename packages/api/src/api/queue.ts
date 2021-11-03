import { Router } from 'express';
import logger from '../logger';
import { QueueUser, QueueType, QueueStatus } from '../entities/QueueUser';

export const prizes = Router();

// get all in progress job queue items
// find which one shares a user with the one sent and then find the location in queue
// return the location in the the queue

prizes.get('/:type', async (req, res) => {
    const { type } = req.params;
    const { user } = req.body;

    if(type !in QueueType) {
        res.status(400).send('The queue type entered was invalid');
        return;
    }

    try {
        const queueList = await req.entityManager.find(
            QueueUser,
            { type, status: 'InProgress' },
            { orderBy: { updatedAt: 'ASC' }},
        );
        const queueUser = queueList.filter(queueItem => queueItem.user.id.includes(user.id))
        const position = queueList.indexOf(queueUser[0]);
        res.send(position);
    } catch (err) {
        const errorMsg = 'There was an issue fetching a list of users from the user queue';
        logger.error(`${errorMsg}: `, err);
        res.status(500).send(errorMsg);
    }

    if(type === QueueType.Job) {

    }
    res.status(400).send('There was an issue');
});
