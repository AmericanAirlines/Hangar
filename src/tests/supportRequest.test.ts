import 'jest';
import { DateTime } from 'luxon';
import { SupportRequest, SupportRequestStatus, SupportRequestType, SupportRequestErrors } from '../entities/supportRequest';
import { Team } from '../entities/team';
import { createDbConnection, closedbConnection } from './testdb';
import { createTeamData } from './utilities';

/* eslint-disable no-await-in-loop */

describe('support request', () => {
  let teams: Team[];

  beforeEach(async () => {
    await createDbConnection();
    teams = await createTeamData(5);
  });

  afterEach(async () => {
    await closedbConnection();
  });

  it('a team can request support', async () => {
    const team = teams[0];

    const supportRequest = new SupportRequest(team.id, SupportRequestType.IdeaPitch);
    await supportRequest.save();
    expect(supportRequest.id).toBeDefined();
  });

  it('the status of a new support request item will default to Pending', async () => {
    const team = teams[0];

    const supportRequest = new SupportRequest(team.id, SupportRequestType.IdeaPitch);
    await supportRequest.save();
    expect(supportRequest.status).toBe(SupportRequestStatus.Pending);
  });

  it('requesting support while already in the queue will throw an error', async () => {
    const team = teams[0];

    const supportRequest1 = new SupportRequest(team.id, SupportRequestType.IdeaPitch);
    await supportRequest1.save();
    expect(supportRequest1.status).toBe(SupportRequestStatus.Pending);

    const supportRequest2 = new SupportRequest(team.id, SupportRequestType.IdeaPitch);
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

  it('a team can rejoin the queue if their previous request is stale', async () => {
    const team = teams[0];

    const supportRequest1 = new SupportRequest(team.id, SupportRequestType.IdeaPitch);
    await supportRequest1.save();
    supportRequest1.movedToInProgressAt = DateTime.local()
      .plus({ minutes: 16 })
      .toJSDate();
    supportRequest1.status = SupportRequestStatus.InProgress;
    await supportRequest1.save();

    const supportRequest2 = new SupportRequest(team.id, SupportRequestType.IdeaPitch);
    await supportRequest2.save();
    expect(supportRequest2.id).toBeDefined();
  });

  it('a team can request support after previously haven gotten support', async () => {
    const team = teams[0];

    const supportRequest1 = new SupportRequest(team.id, SupportRequestType.IdeaPitch);
    supportRequest1.status = SupportRequestStatus.Complete;
    await supportRequest1.save();

    const supportRequest2 = new SupportRequest(team.id, SupportRequestType.IdeaPitch);
    await supportRequest2.save();
    expect(supportRequest2.id).toBeDefined();
  });

  it('requests for each type will be served FIFO', async () => {
    const team1 = teams[0];

    const supportRequest1 = new SupportRequest(team1.id, SupportRequestType.IdeaPitch);
    await supportRequest1.save();

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const team2 = teams[1];
    const supportRequest2 = new SupportRequest(team2.id, SupportRequestType.IdeaPitch);
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
