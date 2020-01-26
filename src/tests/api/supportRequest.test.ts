import 'jest';
jest.mock('../../slack/utilities/messageUsers');
import supertest from 'supertest';
import { SupportRequest, SupportRequestType, SupportRequestStatus } from '../../entities/supportRequest';
import { createDbConnection, closeDbConnection } from '../testdb';
import '../../slack/utilities/messageUsers';

const adminSecret = 'Secrets are secretive';

/* eslint-disable @typescript-eslint/no-var-requires, global-require */

describe('api/judging', () => {
  beforeEach(async () => {
    await createDbConnection();
  });

  afterEach(async () => {
    await closeDbConnection();
  });

  beforeEach(() => {
    process.env.ADMIN_SECRET = adminSecret;
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
      .send({ supportRequestId: supportRequest.id, timeElapsed: '' })
      .set({
        Authorization: adminSecret,
        'Content-Type': 'application/json',
      })
      .expect(200);

    await supportRequest.reload();

    expect(supportRequest.status).toEqual(SupportRequestStatus.Abandoned);
  });
});
