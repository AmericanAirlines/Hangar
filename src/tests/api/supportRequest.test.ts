import 'jest';
import supertest from 'supertest';
import { SelectQueryBuilder } from 'typeorm';
import { SupportRequest } from '../../entities/supportRequest';
import { SupportRequestType, SupportRequestStatus } from '../../types/supportRequest';
import * as messageUsers from '../../common/messageUsers';
import * as requireAuth from '../../api/middleware/requireAuth';
import logger from '../../logger';
import { stringDictionary } from '../../StringDictionary';

/* eslint-disable @typescript-eslint/no-var-requires, global-require */

jest.mock('../../discord');
jest.mock('../../env');
jest.spyOn(logger, 'info').mockImplementation();
const loggerErrorSpy = jest.spyOn(logger, 'error').mockImplementation();
const sendMessageSpy = jest.spyOn(messageUsers, 'sendMessage').mockImplementation();
const supportRequestFindSpy = jest.spyOn(SupportRequest, 'find');
const supportRequestFindOneSpy = jest.spyOn(SupportRequest, 'findOne');
const mockQueryBuilder = {
  update: jest.fn().mockReturnThis(),
  set: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  execute: jest.fn().mockReturnThis(),
};
jest
  .spyOn(SupportRequest, 'createQueryBuilder')
  .mockReturnValue((mockQueryBuilder as Partial<SelectQueryBuilder<SupportRequest>>) as SelectQueryBuilder<SupportRequest>);

const supportRequestGetNextSupportRequestSpy = jest.spyOn(SupportRequest, 'getNextSupportRequest');

jest.spyOn(requireAuth, 'requireAuth').mockImplementation(() => (req, res, next): void => next());

describe('api/supportRequest', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('/getNext', () => {
    it('calling getNext without supportName will throw a 400', async () => {
      const { app } = require('../../app');
      await supertest(app)
        .post('/api/supportRequest/getNext')
        .set({
          'Content-Type': 'application/json',
        })
        .expect(400);
    });

    it('calling getNext without proper requestType will be a 400', async () => {
      const { app } = require('../../app');
      await supertest(app)
        .post('/api/supportRequest/getNext')
        .send({ supportName: 'Tim', requestType: 'a' })
        .set({
          'Content-Type': 'application/json',
        })
        .expect(400);
    });

    it('will successfully identify the next technical support request and notify the user', async () => {
      const supportRequest = new SupportRequest('slackId', 'name', SupportRequestType.TechnicalSupport);
      supportRequest.status = SupportRequestStatus.InProgress;
      supportRequestGetNextSupportRequestSpy.mockResolvedValueOnce(supportRequest);
      const supportRequestSuccessSpy = jest.spyOn(stringDictionary, 'supportRequestSuccess');
      const supportName = 'Tim';
      const { app } = require('../../app');
      const response = await supertest(app)
        .post('/api/supportRequest/getNext')
        .send({ supportName, requestType: supportRequest.type })
        .set({
          'Content-Type': 'application/json',
        })
        .expect(200);

      expect(sendMessageSpy.mock.calls[0][0]).toEqual([supportRequest.slackId]);
      expect(supportRequestSuccessSpy).toHaveBeenCalledWith({ name: supportRequest.name, supportName, type: supportRequest.type });
      expect(response.body.userNotified).toBe(true);
    });

    it('will successfully identify the next idea pitch request and notify the user', async () => {
      const supportRequest = new SupportRequest('slackId', 'name', SupportRequestType.IdeaPitch);
      supportRequest.status = SupportRequestStatus.InProgress;
      supportRequestGetNextSupportRequestSpy.mockResolvedValueOnce(supportRequest);
      const supportRequestSuccessSpy = jest.spyOn(stringDictionary, 'supportRequestSuccess');
      const supportName = 'Tim';
      const { app } = require('../../app');
      const response = await supertest(app)
        .post('/api/supportRequest/getNext')
        .send({ supportName, requestType: supportRequest.type })
        .set({
          'Content-Type': 'application/json',
        })
        .expect(200);

      expect(sendMessageSpy.mock.calls[0][0]).toEqual([supportRequest.slackId]);
      expect(supportRequestSuccessSpy).toHaveBeenCalledWith({ name: supportRequest.name, supportName, type: supportRequest.type });
      expect(response.body.userNotified).toBe(true);
    });

    it('will successfully identify the next jobChat and notify the user', async () => {
      const supportRequest = new SupportRequest('slackId', 'name', SupportRequestType.JobChat);
      supportRequest.status = SupportRequestStatus.InProgress;
      supportRequestGetNextSupportRequestSpy.mockResolvedValueOnce(supportRequest);
      const jobChatSuccessSpy = jest.spyOn(stringDictionary, 'jobChatSuccess');
      const supportName = 'Tim';
      const { app } = require('../../app');
      const response = await supertest(app)
        .post('/api/supportRequest/getNext')
        .send({ supportName, requestType: supportRequest.type })
        .set({
          'Content-Type': 'application/json',
        })
        .expect(200);

      expect(sendMessageSpy.mock.calls[0][0]).toEqual([supportRequest.slackId]);
      expect(jobChatSuccessSpy).toHaveBeenCalledWith({ supportName, type: supportRequest.type });
      expect(response.body.userNotified).toBe(true);
    });

    it("will successfully identify the next request and mark that the user was not notified if they can't be reached", async () => {
      const supportRequest = new SupportRequest('slackId', 'name', SupportRequestType.IdeaPitch);
      supportRequest.status = SupportRequestStatus.InProgress;
      supportRequestGetNextSupportRequestSpy.mockResolvedValueOnce(supportRequest);
      sendMessageSpy.mockRejectedValueOnce(new Error('idk who this is'));

      const { app } = require('../../app');
      const response = await supertest(app)
        .post('/api/supportRequest/getNext')
        .send({ supportName: 'Tim', requestType: 'IdeaPitch' })
        .set({
          'Content-Type': 'application/json',
        })
        .expect(200);

      expect(sendMessageSpy.mock.calls[0][0]).toEqual([supportRequest.slackId]);
      expect(loggerErrorSpy).toBeCalled();
      expect(response.body.userNotified).toBe(false);
    });

    it('will return a 500 if an error occurs while trying to get the next request', async () => {
      const supportRequest = new SupportRequest('slackId', 'name', SupportRequestType.IdeaPitch);
      supportRequest.status = SupportRequestStatus.InProgress;
      supportRequestGetNextSupportRequestSpy.mockRejectedValueOnce(new Error('Oh no!'));

      const { app } = require('../../app');
      await supertest(app)
        .post('/api/supportRequest/getNext')
        .send({ supportName: 'Tim', requestType: 'IdeaPitch' })
        .set({
          'Content-Type': 'application/json',
        })
        .expect(500);
      expect(loggerErrorSpy).toBeCalled();
    });

    it('will return a 200 without a request if a next request does not exist', async () => {
      supportRequestGetNextSupportRequestSpy.mockResolvedValueOnce(null);

      const { app } = require('../../app');
      const response = await supertest(app)
        .post('/api/supportRequest/getNext')
        .send({ supportName: 'Tim', requestType: 'IdeaPitch' })
        .set({
          'Content-Type': 'application/json',
        })
        .expect(200);

      expect(response.body.supportRequest).toBe(null);
      expect(response.body.userNotified).toBe(false);
    });
  });

  describe('/remindUser', () => {
    it('will throw a 400 if an id is not entered', async () => {
      const { app } = require('../../app');
      await supertest(app)
        .post('/api/supportRequest/remindUser')
        .send({ relativeTimeElapsedString: 'some time ago' })
        .set({
          'Content-Type': 'application/json',
        })
        .expect(400);
    });
    it('will throw a 400 if a relativeTimeElapsedString is not entered', async () => {
      const { app } = require('../../app');
      await supertest(app)
        .post('/api/supportRequest/remindUser')
        .send({ supportRequestId: 123123 })
        .set({
          'Content-Type': 'application/json',
        })
        .expect(400);
    });

    it('will throw a 404 if the support request cannot be found', async () => {
      supportRequestFindOneSpy.mockReturnValueOnce(null);
      const { app } = require('../../app');
      await supertest(app)
        .post('/api/supportRequest/remindUser')
        .send({ supportRequestId: 1e6, relativeTimeElapsedString: 'some time ago', voiceChannelName: 'voice channel' })
        .set({
          'Content-Type': 'application/json',
        })
        .expect(404);
    });

    it('will send a message to the person Responsible for the support request', async () => {
      const supportRequest = new SupportRequest('slackId', 'name', SupportRequestType.IdeaPitch);
      supportRequest.status = SupportRequestStatus.InProgress;
      supportRequest.id = 1818;
      supportRequestFindOneSpy.mockResolvedValueOnce(supportRequest);
      const { app } = require('../../app');
      await supertest(app)
        .post('/api/supportRequest/remindUser')
        .send({ supportRequestId: supportRequest.id, relativeTimeElapsedString: 'some time ago', voiceChannelName: 'voice channel' })
        .set({
          'Content-Type': 'application/json',
        })
        .expect(200);

      expect(sendMessageSpy.mock.calls[0][0]).toEqual([supportRequest.slackId]);
    });

    it('will throw a 500 if the user cannot be messaged', async () => {
      const supportRequest = new SupportRequest('slackId', 'name', SupportRequestType.IdeaPitch);
      supportRequest.status = SupportRequestStatus.InProgress;
      supportRequestFindOneSpy.mockResolvedValueOnce(supportRequest);
      sendMessageSpy.mockRejectedValueOnce('Error messaging user');
      const { app } = require('../../app');
      await supertest(app)
        .post('/api/supportRequest/remindUser')
        .send({ supportRequestId: 1, relativeTimeElapsedString: 'some time ago', voiceChannelName: 'voice channel' })
        .set({
          'Content-Type': 'application/json',
        })
        .expect(500);
    });
  });

  describe('/closeRequest', () => {
    it('will throw a 400 when called without supportRequestId', async () => {
      const { app } = require('../../app');
      await supertest(app)
        .post('/api/supportRequest/closeRequest')
        .set({
          'Content-Type': 'application/json',
        })
        .expect(400);
    });

    it('will set the status to complete', async () => {
      const supportRequest = new SupportRequest('slackId', 'name', SupportRequestType.IdeaPitch);
      supportRequest.status = SupportRequestStatus.InProgress;
      supportRequest.id = 1234;
      supportRequestFindOneSpy.mockResolvedValueOnce(supportRequest);

      const { app } = require('../../app');
      await supertest(app)
        .post('/api/supportRequest/closeRequest')
        .send({ supportRequestId: supportRequest.id })
        .set({
          'Content-Type': 'application/json',
        })
        .expect(200);

      expect(mockQueryBuilder.set).toBeCalledWith({ status: SupportRequestStatus.Complete });
      expect(mockQueryBuilder.where).toBeCalledWith({ id: supportRequest.id });
      expect(sendMessageSpy.mock.calls[0][0]).toEqual([supportRequest.slackId]);
    });

    it('will throw a 500 if something goes wrong', async () => {
      mockQueryBuilder.execute.mockRejectedValueOnce('Oops...');

      const { app } = require('../../app');
      await supertest(app)
        .post('/api/supportRequest/closeRequest')
        .send({ supportRequestId: 1234 })
        .set({
          'Content-Type': 'application/json',
        })
        .expect(500);

      expect(sendMessageSpy).not.toBeCalled();
      expect(loggerErrorSpy).toBeCalled();
    });
  });

  describe('/abandonRequest', () => {
    it('will throw a 400 if called without supportRequestId', async () => {
      const { app } = require('../../app');
      await supertest(app)
        .post('/api/supportRequest/abandonRequest')
        .send({ relativeTimeElapsedString: 'some time ago' })
        .set({
          'Content-Type': 'application/json',
        })
        .expect(400);
    });

    it('will throw a 400 if called without relativeTimeElapsedString', async () => {
      const { app } = require('../../app');
      await supertest(app)
        .post('/api/supportRequest/abandonRequest')
        .send({ supportRequestId: 1 })
        .set({
          'Content-Type': 'application/json',
        })
        .expect(400);
    });

    it('will set the status to abandoned', async () => {
      const supportRequest = new SupportRequest('slackId', 'name', SupportRequestType.IdeaPitch);
      supportRequest.id = 3628;
      supportRequest.status = SupportRequestStatus.InProgress;
      supportRequestFindOneSpy.mockResolvedValueOnce(supportRequest);

      const { app } = require('../../app');
      await supertest(app)
        .post('/api/supportRequest/abandonRequest')
        .send({ supportRequestId: supportRequest.id, relativeTimeElapsedString: 'some time ago' })
        .set({
          'Content-Type': 'application/json',
        })
        .expect(200);

      expect(mockQueryBuilder.set).toBeCalledWith({ status: SupportRequestStatus.Abandoned });
      expect(mockQueryBuilder.where).toBeCalledWith({ id: supportRequest.id });
      expect(sendMessageSpy.mock.calls[0][0]).toEqual([supportRequest.slackId]);
    });

    it('will throw a 500 if something goes wrong', async () => {
      const { app } = require('../../app');
      await supertest(app)
        .post('/api/supportRequest/abandonRequest')
        .send({ supportRequestId: 1234, relativeTimeElapsedString: 'some time ago' })
        .set({
          'Content-Type': 'application/json',
        })
        .expect(500);

      expect(sendMessageSpy).not.toBeCalled();
      expect(loggerErrorSpy).toBeCalled();
    });
  });

  describe('/getInProgress', () => {
    it('getting all will return an empty array when no in-progress exist', async () => {
      supportRequestFindSpy.mockResolvedValueOnce([]);

      const { app } = require('../../app');
      const result = await supertest(app)
        .get('/api/supportRequest/getInProgress')
        .expect(200);

      expect(result.body).toEqual([]);
      expect(supportRequestFindSpy.mock.calls[0][0]).toEqual({
        where: { status: SupportRequestStatus.InProgress },
        order: { movedToInProgressAt: 'DESC' },
      });
    });

    it('getting all will return an empty array when no in-progress exist', async () => {
      const supportRequest = new SupportRequest('slackId', 'name', SupportRequestType.IdeaPitch);
      supportRequest.status = SupportRequestStatus.InProgress;
      supportRequestFindSpy.mockResolvedValueOnce([new SupportRequest('slackId', 'name', SupportRequestType.IdeaPitch)]);

      const { app } = require('../../app');
      const result = await supertest(app)
        .get('/api/supportRequest/getInProgress')
        .expect(200);

      expect(result.body.length).toEqual(1);
    });
  });

  describe('/getSpecific', () => {
    it('will throw a 400 if an support id is not entered', async () => {
      const { app } = require('../../app');
      await supertest(app)
        .patch('/api/supportRequest/getSpecific')
        .send({ supportName: 'Jimbo' })
        .set({
          'Content-Type': 'application/json',
        })
        .expect(400);
    });

    it('will throw a 400 if a support name is not entered', async () => {
      const { app } = require('../../app');
      await supertest(app)
        .patch('/api/supportRequest/getSpecific')
        .send({ supportRequestId: 1213 })
        .set({
          'Content-Type': 'application/json',
        })
        .expect(400);
    });

    it("will throw a 400 if the support request can't be found", async () => {
      supportRequestFindOneSpy.mockResolvedValueOnce(null);
      const { app } = require('../../app');
      await supertest(app)
        .patch('/api/supportRequest/getSpecific')
        .send({ supportRequestId: 5000, supportName: 'Jimbo' })
        .set({
          'Content-Type': 'application/json',
        })
        .expect(400);
    });

    it('will change the status of a specific support request to InProgress', async () => {
      const supportRequest = new SupportRequest('slackId', 'name', SupportRequestType.IdeaPitch);
      supportRequest.status = SupportRequestStatus.Pending;
      supportRequest.id = 27278;
      supportRequestFindOneSpy.mockResolvedValueOnce(supportRequest);

      const { app } = require('../../app');
      await supertest(app)
        .patch('/api/supportRequest/getSpecific')
        .send({ supportRequestId: supportRequest.id, supportName: 'Jimbo' })
        .set({
          'Content-Type': 'application/json',
        })
        .expect(200);

      expect(mockQueryBuilder.set).toBeCalledWith({ status: SupportRequestStatus.InProgress });
      expect(mockQueryBuilder.where).toBeCalledWith({ id: supportRequest.id, status: SupportRequestStatus.Pending });
      expect(sendMessageSpy.mock.calls[0][0]).toEqual([supportRequest.slackId]);
    });

    it('will throw a 500 if something goes wrong opening an request', async () => {
      const supportRequest = new SupportRequest('slackId', 'name', SupportRequestType.IdeaPitch);
      supportRequest.status = SupportRequestStatus.Pending;
      supportRequest.id = 27278;
      supportRequestFindOneSpy.mockResolvedValueOnce(supportRequest);
      mockQueryBuilder.execute.mockRejectedValueOnce(new Error('Whoops!'));

      const { app } = require('../../app');
      await supertest(app)
        .patch('/api/supportRequest/getSpecific')
        .send({ supportRequestId: supportRequest.id, supportName: 'Jimbo' })
        .set({
          'Content-Type': 'application/json',
        })
        .expect(500);

      expect(loggerErrorSpy).toBeCalled();
    });

    it("will succeed even if the user can't be notified", async () => {
      const supportRequest = new SupportRequest('slackId', 'name', SupportRequestType.IdeaPitch);
      supportRequest.status = SupportRequestStatus.Pending;
      supportRequest.id = 27278;
      supportRequestFindOneSpy.mockResolvedValueOnce(supportRequest);
      sendMessageSpy.mockRejectedValueOnce(new Error('Cannot message user'));

      const { app } = require('../../app');
      await supertest(app)
        .patch('/api/supportRequest/getSpecific')
        .send({ supportRequestId: supportRequest.id, supportName: 'Jimbo' })
        .set({
          'Content-Type': 'application/json',
        })
        .expect(200);

      expect(loggerErrorSpy).toBeCalled();
    });
  });

  describe('/getAll', () => {
    it('will throw an error if /getAll is called with an invalid status', async () => {
      const { app } = require('../../app');
      const request = await supertest(app)
        .get('/api/supportRequest/getAll?status=wat')
        .set({
          'Content-Type': 'application/json',
        })
        .expect(400);
      expect(request.text).toEqual('Invalid Status');
      expect(supportRequestFindSpy).not.toBeCalled();
    });

    it('will return supportRequests of different status if a status is not provided', async () => {
      supportRequestFindSpy.mockResolvedValue([]);
      const { app } = require('../../app');
      await supertest(app)
        .get('/api/supportRequest/getAll')
        .set({
          'Content-Type': 'application/json',
        })
        .expect(200);

      expect(supportRequestFindSpy).toBeCalledTimes(1);
      expect(supportRequestFindSpy.mock.calls[0][0]).toBeUndefined();
    });

    it('will return supportRequests of specific status if a valid status is provided', async () => {
      const { app } = require('../../app');
      await supertest(app)
        .get('/api/supportRequest/getAll?status=Pending')
        .set({
          'Content-Type': 'application/json',
        })
        .expect(200);

      expect(supportRequestFindSpy).toBeCalledTimes(1);
      expect(supportRequestFindSpy.mock.calls[0][0]).toEqual({ status: 'Pending' });
    });

    it('will throw a 500 if a database error occurs', async () => {
      supportRequestFindSpy.mockRejectedValueOnce('Womp womp');
      const { app } = require('../../app');
      await supertest(app)
        .get('/api/supportRequest/getAll')
        .set({
          'Content-Type': 'application/json',
        })
        .expect(500);

      expect(supportRequestFindSpy).toBeCalledTimes(1);
    });
  });

  describe('/getCount', () => {
    it('calling getCount will respond with the correct count for technical and idea requests', async () => {
      const mockCounts = {
        [SupportRequestType.TechnicalSupport]: 3,
        [SupportRequestType.IdeaPitch]: 12,
        [SupportRequestType.JobChat]: 2,
      };

      jest.spyOn(SupportRequest, 'count').mockImplementation(
        async (request): Promise<number> => {
          const type = (request as { [id: string]: string }).type as SupportRequestType;
          return mockCounts[type];
        },
      );

      const { app } = require('../../app');
      const countData = await supertest(app)
        .get('/api/supportRequest/getCount')
        .set({
          'Content-Type': 'application/json',
        });

      expect(countData.body[SupportRequestType.IdeaPitch]).toBe(mockCounts[SupportRequestType.IdeaPitch]);
      expect(countData.body[SupportRequestType.TechnicalSupport]).toBe(mockCounts[SupportRequestType.TechnicalSupport]);
      expect(countData.body[SupportRequestType.JobChat]).toBe(mockCounts[SupportRequestType.JobChat]);
    });

    it('calling getCount will respond with a 500 if something goes wrong', async () => {
      jest.spyOn(SupportRequest, 'count').mockRejectedValueOnce('Oh no!');

      const { app } = require('../../app');
      const countData = await supertest(app)
        .get('/api/supportRequest/getCount')
        .set({
          'Content-Type': 'application/json',
        })
        .expect(500);

      expect(countData.text).toBe('Something went wrong retrieving support request count.');
      expect(loggerErrorSpy).toBeCalledTimes(1);
    });
  });
});
