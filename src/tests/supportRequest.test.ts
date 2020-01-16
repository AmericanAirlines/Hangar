import 'jest';
import { DateTime } from 'luxon';
import { SupportRequest, SupportRequestStatus, SupportRequestType, SupportRequestErrors } from '../entities/supportRequest';
import { createDbConnection, closedbConnection } from './testdb';

/* eslint-disable no-await-in-loop */

describe('support request', () => {
  const slackIds = ['abcd', 'efgh', 'ijkl'];

  beforeEach(async () => {
    await createDbConnection();
  });

  afterEach(async () => {
    await closedbConnection();
  });

  it('a user can request support', async () => {
    const slackId = slackIds[0];

    const supportRequest = new SupportRequest(slackId, SupportRequestType.IdeaPitch);
    await supportRequest.save();
    expect(supportRequest.id).toBeDefined();
  });

  it('the status of a new support request item will default to Pending', async () => {
    const slackId = slackIds[0];

    const supportRequest = new SupportRequest(slackId, SupportRequestType.IdeaPitch);
    await supportRequest.save();
    expect(supportRequest.status).toBe(SupportRequestStatus.Pending);
  });

  it('requesting support while already in the queue will throw an error', async () => {
    const slackId = slackIds[0];

    const supportRequest1 = new SupportRequest(slackId, SupportRequestType.IdeaPitch);
    await supportRequest1.save();
    expect(supportRequest1.status).toBe(SupportRequestStatus.Pending);

    const supportRequest2 = new SupportRequest(slackId, SupportRequestType.IdeaPitch);
    try {
      await supportRequest2.save();
      throw new Error('Expected error');
    } catch (err) {
      expect(err.name).toBe(SupportRequestErrors.ExistingActiveRequest);
    }

    supportRequest1.status = SupportRequestStatus.InProgress;
    await supportRequest1.save();
    expect(supportRequest1.status).toBe(SupportRequestStatus.InProgress);

    try {
      await supportRequest2.save();
      throw new Error('Expected error');
    } catch (err) {
      expect(err.name).toBe(SupportRequestErrors.ExistingActiveRequest);
    }
  });

  it('a user can rejoin the queue if their previous request is stale', async () => {
    const slackId = slackIds[0];

    const supportRequest1 = new SupportRequest(slackId, SupportRequestType.IdeaPitch);
    await supportRequest1.save();
    supportRequest1.movedToInProgressAt = DateTime.local()
      .plus({ minutes: 16 })
      .toJSDate();
    supportRequest1.status = SupportRequestStatus.InProgress;
    await supportRequest1.save();

    const supportRequest2 = new SupportRequest(slackId, SupportRequestType.IdeaPitch);
    await supportRequest2.save();
    expect(supportRequest2.id).toBeDefined();
  });

  it('a user can request support after previously haven gotten support', async () => {
    const slackId = slackIds[0];

    const supportRequest1 = new SupportRequest(slackId, SupportRequestType.IdeaPitch);
    supportRequest1.status = SupportRequestStatus.Complete;
    await supportRequest1.save();

    const supportRequest2 = new SupportRequest(slackId, SupportRequestType.IdeaPitch);
    await supportRequest2.save();
    expect(supportRequest2.id).toBeDefined();
  });

  it('requests for each type will be served FIFO', async () => {
    const slackId1 = slackIds[0];

    const supportRequest1 = new SupportRequest(slackId1, SupportRequestType.IdeaPitch);
    await supportRequest1.save();

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const slackId2 = slackIds[1];
    const supportRequest2 = new SupportRequest(slackId2, SupportRequestType.IdeaPitch);
    await supportRequest2.save();

    const nextRequest = await SupportRequest.getNextSupportRequest();
    expect(nextRequest.id).toBe(supportRequest1.id);
    expect(nextRequest.status).toBe(SupportRequestStatus.InProgress);
  });

  it('if a request cannot be found, null will be returned', async () => {
    const nextRequest = await SupportRequest.getNextSupportRequest();
    expect(nextRequest).toBeNull();
  });
});
