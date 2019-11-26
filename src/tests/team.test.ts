import 'jest';
import { Team } from '../entities/team';
import { createDbConnection, closedbConnection } from './testdb';

/* eslint-disable no-await-in-loop */

describe('judging', () => {
  let team: Team;

  beforeEach(async () => {
    await createDbConnection();

    team = await new Team('Some Team', 123, 'Something cool', ['1']).save();
  });

  afterEach(async () => {
    await closedbConnection();
  });

  it('decrement reduces activeJudgeCount by 1', async () => {
    team.activeJudgeCount = 2;
    await team.save();
    await team.decrementActiveJudgeCount();
    let updatedTeam = await Team.findOneOrFail(team.id);
    expect(updatedTeam.activeJudgeCount).toEqual(1);

    await team.decrementActiveJudgeCount();
    updatedTeam = await Team.findOneOrFail(team.id);
    expect(updatedTeam.activeJudgeCount).toEqual(0);
  });

  it('activeJudgeCount will never drop below 0', async () => {
    team.activeJudgeCount = 0;
    await team.decrementActiveJudgeCount();
    const updatedTeam = await Team.findOneOrFail(team.id);
    expect(updatedTeam.activeJudgeCount).toEqual(0);
  });

  it('incrementJudgeVisits bumps judgeVisits by 1', async () => {
    await team.incrementJudgeVisits();
    let updatedTeam = await Team.findOneOrFail(team.id);
    expect(updatedTeam.judgeVisits).toEqual(1);

    await team.incrementJudgeVisits();
    updatedTeam = await Team.findOneOrFail(team.id);
    expect(updatedTeam.judgeVisits).toEqual(2);
  });
});
