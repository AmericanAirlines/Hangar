import express from 'express';
import { SupportRequest, SupportRequestStatus, SupportRequestType } from '../entities/supportRequest';
import logger from '../logger';
import messageUsers from '../slack/utilities/messageUsers';

export const supportRequestRoutes = express.Router();

supportRequestRoutes.use(express.json());

export interface NextSupportRequestResponse {
  supportRequest: SupportRequest;
  userNotified: boolean;
}

supportRequestRoutes.get('/getAll', async (req, res) => {
  const { status } = req.query;
  const isValidStatus = Object.values(SupportRequestStatus).includes(status);

  if (status && !isValidStatus) {
    res.status(400).send('Invalid Status');
    return;
  }

  try {
    let requests;
    if (status) {
      requests = await SupportRequest.find({ status });
    } else {
      requests = await SupportRequest.find();
    }
    res.send(requests);
  } catch (error) {
    res.status(500).send('There Was An Internal Server Error');
  }
});

supportRequestRoutes.get('/getCount', async (req, res) => {
  const ideaCount = await SupportRequest.count({ type: SupportRequestType.IdeaPitch, status: SupportRequestStatus.Pending });
  const technicalCount = await SupportRequest.count({ type: SupportRequestType.TechnicalSupport, status: SupportRequestStatus.Pending });

  res.json({
    ideaCount,
    technicalCount,
  });
});

supportRequestRoutes.get('/getInProgress', async (req, res) => {
  const openRequests = await SupportRequest.find({
    where: { status: SupportRequestStatus.InProgress },
    order: { movedToInProgressAt: 'DESC' },
  });
  res.send(openRequests);
});

supportRequestRoutes.post('/getNext', async (req, res) => {
  const { adminName } = req.body;

  if (!adminName || !adminName.trim()) {
    res.status(400).send("Property 'adminName' is required");
    return;
  }

  let nextRequest;
  try {
    nextRequest = await SupportRequest.getNextSupportRequest();
  } catch (err) {
    res.status(500).send('Something went wrong trying to get the next support request');
    logger.error('Something went wrong trying to get the next support request', err);
    return;
  }

  let userNotified = false;
  try {
    if (nextRequest) {
      await messageUsers(
        [nextRequest.slackId],
        `:tada: ${adminName} is ready to ${
          nextRequest.type === SupportRequestType.IdeaPitch ? 'help you with an idea' : 'help with your technical issue'
        }, so head over to our booth. Feel free to bring other members of your team and make sure to bring your laptop if relevant.\n\nWhen you arrive, tell one of our team members that you're here to meet with *${adminName}*!`,
      );
      userNotified = true;
    }
  } catch (err) {
    logger.error("Unable to notify users they're support request has been served", err);
  }

  const response: NextSupportRequestResponse = {
    userNotified,
    supportRequest: nextRequest,
  };
  res.send(response);
});

supportRequestRoutes.post('/closeRequest', async (req, res) => {
  const { supportRequestId } = req.body;

  if (!supportRequestId) {
    res.status(400).send("Property 'supportRequestId' is required");
    return;
  }

  try {
    await SupportRequest.createQueryBuilder('supportRequest')
      .update()
      .set({
        status: SupportRequestStatus.Complete,
      })
      .where({
        id: supportRequestId,
      })
      .execute();

    res.sendStatus(200);
  } catch (err) {
    res.status(500).send('Unable to close request');
    logger.error(err);
  }
});

supportRequestRoutes.post('/abandonRequest', async (req, res) => {
  const { supportRequestId, relativeTimeElapsedString } = req.body;

  if (!supportRequestId || !relativeTimeElapsedString) {
    res.status(400).send("Property 'supportRequestId' is required");
    return;
  }

  try {
    await SupportRequest.createQueryBuilder('supportRequest')
      .update()
      .set({
        status: SupportRequestStatus.Abandoned,
      })
      .where({
        id: supportRequestId,
      })
      .execute();

    const supportRequest = await SupportRequest.findOne(supportRequestId);
    await messageUsers(
      [supportRequest.slackId],
      `:exclamation: We messaged you about your support request ${relativeTimeElapsedString}, but we didn't hear from you at our booth. Your request has been closed, but if you'd still like to meet with our team, please rejoin the queue!`,
    );

    res.sendStatus(200);
  } catch (err) {
    res.status(500).send('Unable to close request');
    logger.error(err);
  }
});
