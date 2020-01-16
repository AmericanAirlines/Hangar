import express from 'express';
import { adminMiddleware } from './adminMiddleware';
import { SupportRequest, SupportRequestStatus, SupportRequestType } from '../entities/supportRequest';
import logger from '../logger';
import messageUsers from '../slack/utilities/messageUsers';

export const supportRequestRoutes = express.Router();
supportRequestRoutes.use(adminMiddleware);

supportRequestRoutes.post('/getNext', async (req, res) => {
  let nextRequest;
  try {
    nextRequest = await SupportRequest.getNextSupportRequest();
    res.send(nextRequest);
  } catch (err) {
    logger.error('Something went wrong trying to get the next support request', err);
    return;
  }

  try {
    await messageUsers(
      [nextRequest.slackId],
      `:tada: We're ready to ${
        nextRequest.type === SupportRequestType.IdeaPitch ? 'help you with an idea' : 'help with your technical issue'
      }, so head over to our booth. Feel free to bring other members of your team and make sure to bring your laptop if relevant.`,
    );
  } catch (err) {
    logger.error("Unable to notify users they're support request has been served", err);
  }
});

supportRequestRoutes.post('/closeRequest', async (req, res) => {
  const { supportRequestId } = req.body;

  if (!supportRequestId) {
    res.status(400).send("Property 'supportRequestId' is required");
    return;
  }

  try {
    const result = await SupportRequest.createQueryBuilder('supportRequest')
      .update()
      .set({
        status: SupportRequestStatus.Complete,
      })
      .where({
        id: supportRequestId,
      })
      .execute();

    if (result.affected > 0) {
      res.sendStatus(200);
    } else {
      res.status(404).send('Support Request not found');
    }
  } catch (err) {
    res.status(500).send('Unable to close request');
    logger.error(err);
  }
});
