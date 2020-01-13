import { Request, Response } from 'express';
import { Subscriber } from '../entities/subscriber';
import messageUsers from '../slack/utilities/messageUsers';
import logger from '../logger';

export default async function sendUpdateMessage(req: Request, res: Response): Promise<void> {
  const { message, secret } = req.body;

  // TODO: Implement auth
  if (secret !== 'some secret') {
    res.sendStatus(403);
    return;
  }

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
}
