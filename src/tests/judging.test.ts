import 'jest';
import { createConnection, getConnectionOptions, ConnectionOptions, getConnection } from 'typeorm';
import path from 'path';
import { SqliteConnectionOptions } from 'typeorm/driver/sqlite/SqliteConnectionOptions';
import { Team } from '../entities/team';
import { Judge } from '../entities/judge';
import judge from '../pages/judge';

/* eslint-disable no-await-in-loop */

describe('judging', () => {
  beforeEach(async () => {
    await createConnection({
      type: 'sqlite',
      database: ':memory:',
      entities: [path.join(__dirname, '../entities/*')],
      synchronize: true,
      dropSchema: true,
    } as SqliteConnectionOptions);
  });

  afterEach(() => getConnection().close());
  it('the in memory database works', async () => {
    const team = await new Team('Does this work?', 123, 'Databases are cool', ['123456']).save();
    Team.findOneOrFail(team.id);
  });

  it('teams are visited evenly', async () => {
    // Score 100 teams for 10 judges and make sure team visits are roughly the same
    // Create mock teams, sorted by performance (0 index == winner)
    const numTeams = 25;
    const numJudges = 10;
    const teams = await createTeamData(numTeams);
    const judges = await createJudgeData(numJudges);

    const percentVisitation = 0.7;

    const currTeamIdx = 0;
    const currJudgeIdx = 0;
    for (let i = 0; i < percentVisitation * numTeams * numJudges; i += 1) {
      const currJudge = judges[currJudgeIdx];
      const team = await currJudge.getNextTeam();
    }
  });

  it('judging a team resets the judges currentTeam', () => {
    // Judge teams with perfect judge accuracy
    // Judge teams with slight imperfections (90% judge accuracy)
    // Compare final results
    expect(0).toBe(0);
  });

  it('judging a team adds the currentTeam to visitedTeams', () => {
    // Judge teams with perfect judge accuracy
    // Judge teams with slight imperfections (90% judge accuracy)
    // Compare final results
    expect(0).toBe(0);
  });

  it("judge inconsistency won't significantly impact scoring", () => {
    // Judge teams with perfect judge accuracy
    // Judge teams with slight imperfections (90% judge accuracy)
    // Compare final results
    expect(0).toBe(0);
  });

  it('if all teams are being judged, the one with the least judges visiting will be used next', () => {
    // Have a judge meet with all teams
    // have a second team visit all but 1 team
    // see if that last team is used
    expect(0).toBe(0);
  });
});

async function createTeamData(numTeams: number): Promise<Team[]> {
  const teams: Team[] = [];
  for (let i = 0; i <= numTeams; i += 1) {
    const team = await new Team(`Team ${i}`, i, `Project for Team ${i}`, [String(i)]).save();
    teams.push(team);
  }
  return teams;
}

async function createJudgeData(numJudges: number): Promise<Judge[]> {
  const judges: Judge[] = [];
  for (let i = 0; i <= numJudges; i += 1) {
    judges.push(await new Judge().save());
  }
  return judges;
}
