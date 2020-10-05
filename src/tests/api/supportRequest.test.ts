import 'jest';
import supertest from 'supertest';
import { SupportRequest, SupportRequestType, SupportRequestStatus } from '../../entities/supportRequest';
import { createDbConnection, closeDbConnection } from '../testdb';
import '../../slack/utilities/messageUsers';
import logger from '../../logger';

jest.mock('../../slack/utilities/messageUsers');

const adminSecret = 'Secrets are secretive';

/* eslint-disable @typescript-eslint/no-var-requires, global-require */

jest.spyOn(logger, 'info').mockImplementation();

describe('api/supportRequest', () => {
  beforeEach(async () => {
    await createDbConnection();
    process.env.ADMIN_SECRET = adminSecret;
    jest.spyOn(logger, 'info').mockImplementation();
  });

  afterEach(async () => {
    await closeDbConnection();
    jest.resetAllMocks();
  });

  it('is protected by admin middleware', (done) => {
    // Hide error output for unauth'd request
    jest.mock('../../logger');

    const { app } = require('../../app');
    supertest(app)
      .get('/api/supportRequest/getInProgress')
      .set({
        Authorization: "YOU DIDN'T SAY THE MAGIC WORD!",
      })
      .expect(401, done);
  });

  it('getting all will return an empty array when no in-progress exist', async () => {
    const suppportRequest = new SupportRequest('slackId', 'name', SupportRequestType.IdeaPitch);
    await suppportRequest.save();

    const { app } = require('../../app');
    const result = await supertest(app)
      .get('/api/supportRequest/getInProgress')
      .set({
        Authorization: adminSecret,
      })
      .expect(200);

    expect(result.body).toEqual([]);
  });

  it('getting all will return an empty array when no in-progress exist', async () => {
    const suppportRequest = new SupportRequest('slackId', 'name', SupportRequestType.IdeaPitch);
    suppportRequest.status = SupportRequestStatus.InProgress;
    await suppportRequest.save();

    const { app } = require('../../app');
    const result = await supertest(app)
      .get('/api/supportRequest/getInProgress')
      .set({
        Authorization: adminSecret,
      })
      .expect(200);

    expect(result.body.length).toEqual(1);
  });

  it('calling closeRequest without supportRequestId will be a 400', async () => {
    const suppportRequest = new SupportRequest('slackId', 'name', SupportRequestType.IdeaPitch);
    suppportRequest.status = SupportRequestStatus.InProgress;
    await suppportRequest.save();

    const { app } = require('../../app');
    await supertest(app)
      .post('/api/supportRequest/closeRequest')
      .set({
        Authorization: adminSecret,
        'Content-Type': 'application/json',
      })
      .expect(400);
  });

  it('calling closeRequest will set the status to complete', async () => {
    const supportRequest = new SupportRequest('slackId', 'name', SupportRequestType.IdeaPitch);
    supportRequest.status = SupportRequestStatus.InProgress;
    await supportRequest.save();

    const { app } = require('../../app');
    await supertest(app)
      .post('/api/supportRequest/closeRequest')
      .send({ supportRequestId: supportRequest.id })
      .set({
        Authorization: adminSecret,
        'Content-Type': 'application/json',
      })
      .expect(200);

    await supportRequest.reload();

    expect(supportRequest.status).toEqual(SupportRequestStatus.Complete);
  });

  it('calling abandonRequest without supportRequestId will be a 400', async () => {
    const suppportRequest = new SupportRequest('slackId', 'name', SupportRequestType.IdeaPitch);
    suppportRequest.status = SupportRequestStatus.InProgress;
    await suppportRequest.save();

    const { app } = require('../../app');
    await supertest(app)
      .post('/api/supportRequest/abandonRequest')
      .send({ relativeTimeElapsedString: 'some time ago' })
      .set({
        Authorization: adminSecret,
        'Content-Type': 'application/json',
      })
      .expect(400);
  });

  it('calling abandonRequest without relativeTimeElapsedString will be a 400', async () => {
    const suppportRequest = new SupportRequest('slackId', 'name', SupportRequestType.IdeaPitch);
    suppportRequest.status = SupportRequestStatus.InProgress;
    await suppportRequest.save();

    const { app } = require('../../app');
    await supertest(app)
      .post('/api/supportRequest/abandonRequest')
      .send({ supportRequestId: 1 })
      .set({
        Authorization: adminSecret,
        'Content-Type': 'application/json',
      })
      .expect(400);
  });

  it('calling abandonRequest will set the status to abandoned', async () => {
    const supportRequest = new SupportRequest('slackId', 'name', SupportRequestType.IdeaPitch);
    supportRequest.status = SupportRequestStatus.InProgress;
    await supportRequest.save();

    jest.mock('../../slack/utilities/messageUsers');
    const { app } = require('../../app');
    await supertest(app)
      .post('/api/supportRequest/abandonRequest')
      .send({ supportRequestId: supportRequest.id, relativeTimeElapsedString: 'some time ago' })
      .set({
        Authorization: adminSecret,
        'Content-Type': 'application/json',
      })
      .expect(200);

    await supportRequest.reload();

    expect(supportRequest.status).toEqual(SupportRequestStatus.Abandoned);
  });

  it('will throw an error if /getAll is called with an invalid status', async () => {
    const supportRequestFindSpy = jest.spyOn(SupportRequest, 'find').mockImplementation();
    const { app } = require('../../app');
    const request = await supertest(app)
      .get('/api/supportRequest/getAll?status=wat')
      .set({
        Authorization: adminSecret,
        'Content-Type': 'application/json',
      })
      .expect(400);
    expect(request.text).toEqual('Invalid Status');
    expect(supportRequestFindSpy).not.toBeCalled();
  });

  it('will return supportRequests of different status if a status is not provided', async () => {
    const supportRequestFindSpy = jest.spyOn(SupportRequest, 'find').mockImplementation();
    const { app } = require('../../app');
    await supertest(app)
      .get('/api/supportRequest/getAll')
      .set({
        Authorization: adminSecret,
        'Content-Type': 'application/json',
      })
      .expect(200);

    expect(supportRequestFindSpy).toBeCalledTimes(1);
    expect(supportRequestFindSpy.mock.calls[0][0]).toBeUndefined();
  });

  it('will return supportRequests of specific status if a valid status is provided', async () => {
    const supportRequestFindSpy = jest.spyOn(SupportRequest, 'find').mockImplementation();
    const { app } = require('../../app');
    await supertest(app)
      .get('/api/supportRequest/getAll?status=Pending')
      .set({
        Authorization: adminSecret,
        'Content-Type': 'application/json',
      })
      .expect(200);

    expect(supportRequestFindSpy).toBeCalledTimes(1);
    expect(supportRequestFindSpy.mock.calls[0][0]).toEqual({ status: 'Pending' });
  });

  it('will throw a 500 if a database error occurs', async () => {
    const supportRequestFindSpy = jest.spyOn(SupportRequest, 'find').mockRejectedValueOnce('Womp womp');
    const { app } = require('../../app');
    await supertest(app)
      .get('/api/supportRequest/getAll')
      .set({
        Authorization: adminSecret,
        'Content-Type': 'application/json',
      })
      .expect(500);

    expect(supportRequestFindSpy).toBeCalledTimes(1);
  });
});
