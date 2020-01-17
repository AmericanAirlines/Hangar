import express from 'express';
import { Subscriber } from '../entities/subscriber';
import messageUsers from '../slack/utilities/messageUsers';
import logger from '../logger';

export const sendUpdateMessage = express.Router();

sendUpdateMessage.post('/', async (req, res) => {
  const { message } = req.body;

  if (!message || !message.trim()) {
    res.status(400).send("Property 'message' must contain content");
    return;
  }

  const subscribers = await Subscriber.find({ isActive: true });
  const users = subscribers.map((user) => user.slackId);

  try {
    await messageUsers(users, message);
    res.sendStatus(200);
  } catch (err) {
    res.status(500).send('Something went wrong sending an update to users; check the logs for more details');
    logger.error(err);
  }
});
