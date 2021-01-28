import express from 'express';
import { SupportRequest } from '../entities/supportRequest';
import { SupportRequestStatus, SupportRequestType } from '../types/supportRequest';
import logger from '../logger';
import { sendMessage } from '../common/messageUsers';
import { stringDictionary } from '../StringDictionary';

export const supportRequestRoutes = express.Router();

supportRequestRoutes.use(express.json());

export interface NextSupportRequestResponse {
  supportRequest: SupportRequest;
  userNotified: boolean;
  type: SupportRequestType;
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
    logger.error('Unable to retrieve support requests: ', error);
    res.status(500).send('There Was An Internal Server Error');
  }
});

supportRequestRoutes.get('/getCount', async (req, res) => {
  try {
    const ideaCount = await SupportRequest.count({ type: SupportRequestType.IdeaPitch, status: SupportRequestStatus.Pending });
    const technicalCount = await SupportRequest.count({ type: SupportRequestType.TechnicalSupport, status: SupportRequestStatus.Pending });
    const jobCount = await SupportRequest.count({ type: SupportRequestType.JobChat, status: SupportRequestStatus.Pending });
    // TODO: Improve the efficiency of these calls

    res.json({
      [SupportRequestType.IdeaPitch]: ideaCount,
      [SupportRequestType.TechnicalSupport]: technicalCount,
      [SupportRequestType.JobChat]: jobCount,
    });
  } catch (err) {
    logger.error('Unable to retrieve count of support requests: ', err);
    res.status(500).send('Something went wrong retrieving support request count.');
  }
});

supportRequestRoutes.get('/getInProgress', async (req, res) => {
  const openRequests = await SupportRequest.find({
    where: { status: SupportRequestStatus.InProgress },
    order: { movedToInProgressAt: 'DESC' },
  });
  res.send(openRequests);
});

supportRequestRoutes.post('/getNext', async (req, res) => {
  const { supportName, requestType } = req.body;
  if (!supportName || !supportName.trim()) {
    res.status(400).send("Property 'supportName' is required");
    return;
  }

  if (requestType && !(requestType in SupportRequestType)) {
    res.status(400).send(`The request type entered is not valid. Please choose from: ${Object.keys(SupportRequestType)}`);
    return;
  }

  let nextRequest;
  try {
    nextRequest = await SupportRequest.getNextSupportRequest(supportName, requestType as SupportRequestType | undefined);
  } catch (err) {
    res.status(500).send('Something went wrong trying to get the next support request');
    logger.error('Something went wrong trying to get the next support request', err);
    return;
  }

  let userNotified = false;

  try {
    if (nextRequest) {
      await sendMessage(
        [nextRequest.slackId],
        requestType === SupportRequestType.JobChat
          ? stringDictionary.jobChatSuccess({ supportName, type: requestType })
          : stringDictionary.supportRequestSuccess({ supportName, type: requestType, name: nextRequest.name }),
      );
      userNotified = true;
    }
  } catch (err) {
    logger.error("Unable to notify users they're support request has been served", err);
  }

  const response: NextSupportRequestResponse = {
    userNotified,
    supportRequest: nextRequest,
    type: requestType,
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

    const supportRequest = await SupportRequest.findOne(supportRequestId);
    await sendMessage([supportRequest.slackId], stringDictionary.supportRequestComplete);

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

    await sendMessage(
      [supportRequest.slackId],
      stringDictionary.supportRequestNoShow({
        relativeTimeElapsedString,
      }),
    );

    res.sendStatus(200);
  } catch (err) {
    res.status(500).send('Unable to close request');
    logger.error(err);
  }
});

supportRequestRoutes.patch('/getSpecific', async (req, res) => {
  const { supportRequestId, requestType, supportName } = req.body;
  if (!supportRequestId || !supportName || !supportName.trim()) {
    res.status(400).send('One or more of the required properties is missing');
    return;
  }

  const request = await SupportRequest.findOne(supportRequestId);
  if (!request || request.status !== SupportRequestStatus.Pending) {
    res.status(400).send('The support request entered is not valid');
    return;
  }
  try {
    await SupportRequest.createQueryBuilder('supportRequest')
      .update()
      .set({
        status: SupportRequestStatus.InProgress,
      })
      .where({
        id: supportRequestId,
        status: SupportRequestStatus.Pending,
      })
      .execute();
  } catch (err) {
    res.status(500).send('Unable To Open A Specific Request');
    logger.error('Something went wrong opening a specific request: ', err);
    return;
  }

  let userNotified = false;

  try {
    await sendMessage(
      [request.slackId],
      stringDictionary.supportRequestSuccess({
        supportName,
        type: requestType,
      }),
    );
    userNotified = true;
  } catch (err) {
    logger.error("Unable to notify users they're support request has been served", err);
  }

  const response: NextSupportRequestResponse = {
    userNotified,
    supportRequest: request,
    type: requestType,
  };
  res.send(response);
});

supportRequestRoutes.post('/remindUser', async (req, res) => {
  const { supportRequestId, relativeTimeElapsedString } = req.body;
  if (!supportRequestId || !relativeTimeElapsedString) {
    res.status(400).send('One or more of the required properties is missing');
    return;
  }

  try {
    const supportRequest = await SupportRequest.findOne(supportRequestId);
    if (!supportRequest) {
      res.status(404).send('Unable to find matching Support Request');
      return;
    }

    await sendMessage(
      [supportRequest.slackId],
      stringDictionary.remindUser({
        relativeTimeElapsedString,
      }),
    );

    res.sendStatus(200);
  } catch (err) {
    res.status(500).send('Unable to remind the user');
    logger.error(err);
  }
});
