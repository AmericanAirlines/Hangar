import 'jest';
import { DateTime } from 'luxon';
import { SupportRequest, SupportRequestStatus, SupportRequestType, SupportRequestErrors } from '../../entities/supportRequest';
import { createDbConnection, closeDbConnection } from '../testdb';

/* eslint-disable no-await-in-loop */

describe('support request', () => {
  const slackIds = ['abcd', 'efgh', 'ijkl'];

  beforeEach(async () => {
    await createDbConnection();
  });

  afterEach(async () => {
    await closeDbConnection();
  });

  it('a user can request support', async () => {
    const slackId = slackIds[0];

    const supportRequest = new SupportRequest(slackId, 'Someone', SupportRequestType.IdeaPitch);
    await supportRequest.save();
    expect(supportRequest.id).toBeDefined();
  });

  it('the status of a new support request item will default to Pending', async () => {
    const slackId = slackIds[0];

    const supportRequest = new SupportRequest(slackId, 'Someone', SupportRequestType.IdeaPitch);
    await supportRequest.save();
    expect(supportRequest.status).toBe(SupportRequestStatus.Pending);
  });

  it('requesting support while already in the queue will throw an error', async () => {
    const slackId = slackIds[0];

    const supportRequest1 = new SupportRequest(slackId, 'Someone', SupportRequestType.IdeaPitch);
    await supportRequest1.save();
    expect(supportRequest1.status).toBe(SupportRequestStatus.Pending);

    const supportRequest2 = new SupportRequest(slackId, 'Someone', SupportRequestType.IdeaPitch);
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

    const supportRequest1 = new SupportRequest(slackId, 'Someone', SupportRequestType.IdeaPitch);
    await supportRequest1.save();
    supportRequest1.movedToInProgressAt = DateTime.local()
      .plus({ minutes: 16 })
      .toJSDate();
    supportRequest1.status = SupportRequestStatus.InProgress;
    await supportRequest1.save();

    const supportRequest2 = new SupportRequest(slackId, 'Someone', SupportRequestType.IdeaPitch);
    await supportRequest2.save();
    expect(supportRequest2.id).toBeDefined();
  });

  it('a user can request support after previously haven gotten support', async () => {
    const slackId = slackIds[0];

    const supportRequest1 = new SupportRequest(slackId, 'Someone', SupportRequestType.IdeaPitch);
    supportRequest1.status = SupportRequestStatus.Complete;
    await supportRequest1.save();

    const supportRequest2 = new SupportRequest(slackId, 'Someone', SupportRequestType.IdeaPitch);
    await supportRequest2.save();
    expect(supportRequest2.id).toBeDefined();
  });

  it('requests for each type will be served FIFO', async () => {
    const slackId1 = slackIds[0];

    const supportRequest1 = new SupportRequest(slackId1, 'Someone', SupportRequestType.IdeaPitch);
    await supportRequest1.save();

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const slackId2 = slackIds[1];
    const supportRequest2 = new SupportRequest(slackId2, 'Someone', SupportRequestType.IdeaPitch);
    await supportRequest2.save();

    const nextRequest = await SupportRequest.getNextSupportRequest();
    expect(nextRequest.id).toBe(supportRequest1.id);
    expect(nextRequest.status).toBe(SupportRequestStatus.InProgress);
  });

  it('requests for each type will be served FIFO with included specified support type', async () => {
    const slackId1 = slackIds[0];

    const supportRequest1 = new SupportRequest(slackId1, 'Someone', SupportRequestType.TechnicalSupport);
    await supportRequest1.save();

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const slackId2 = slackIds[1];
    const supportRequest2 = new SupportRequest(slackId2, 'Someone', SupportRequestType.IdeaPitch);
    await supportRequest2.save();

    const nextRequest = await SupportRequest.getNextSupportRequest(SupportRequestType.IdeaPitch);
    expect(nextRequest.id).toBe(supportRequest2.id);
    expect(nextRequest.status).toBe(SupportRequestStatus.InProgress);
    expect(nextRequest.type).toBe(SupportRequestType.IdeaPitch);
  });

  it('if a request cannot be found, null will be returned', async () => {
    const nextRequest = await SupportRequest.getNextSupportRequest();
    expect(nextRequest).toBeNull();
  });

  it('can handle several simultaneous requests and get unique values', async () => {
    for (let i = 0; i < slackIds.length; i += 1) {
      await new SupportRequest(slackIds[i], slackIds[i], SupportRequestType.IdeaPitch).save();
    }

    const requestPromises = [];
    for (let i = 0; i < slackIds.length; i += 1) {
      requestPromises.push(SupportRequest.getNextSupportRequest());
    }

    expect(Promise.all(requestPromises)).resolves.toHaveLength(slackIds.length);
  });
});
