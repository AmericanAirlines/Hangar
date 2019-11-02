import 'jest';
import { createDbConnection, closedbConnection } from './testdb';
import { Team } from '../entities/team';
import { Judge } from '../entities/judge';

/* eslint-disable no-await-in-loop */

describe('judging logistics', () => {
  beforeEach(async () => {
    await createDbConnection();
  });

  afterEach(async () => {
    await closedbConnection();
  });

  it('the in-memory database works', async () => {
    const team = await new Team('Does this work?', 123, 'Databases are cool', ['123456']).save();
    Team.findOneOrFail(team.id);
  });

  it('judging correctly increments and decrements team counters', async (done) => {
    const judge = await new Judge().save();
    const team = await new Team('Some Team', 123, 'A new app', ['123']).save();

    expect(team.activeJudgeCount).toBe(0);
    expect(team.judgeVisits).toBe(0);

    await judge.getNextTeam();
    await team.reload();
    expect(judge.currentTeam).toEqual(team.id);
    expect(team.activeJudgeCount).toEqual(1);
    expect(team.judgeVisits).toBe(0);

    await judge.continue();
    await judge.reload();

    await judge.getNextTeam();
    await team.reload();

    expect(team.activeJudgeCount).toBe(0);
    expect(team.judgeVisits).toBe(1);
    done();
  });

  it('getNextTeam will only pull unvisited teams', async (done) => {
    const judge = await new Judge().save();
    const team1 = await new Team('Some Team', 123, 'A new app', ['123']).save();
    const team2 = await new Team('Another team', 456, 'Another new app', ['456']).save();

    await judge.getNextTeam();
    expect(judge.currentTeam).toEqual(team1.id);

    await judge.continue();
    expect(judge.currentTeam).toBeNull();

    await judge.getNextTeam();
    expect(judge.currentTeam).toEqual(team2.id);

    done();
  });

  it('current team will be null when all teams have been visted', async (done) => {
    const judge = await new Judge().save();
    const team1 = await new Team('Some Team', 123, 'A new app', ['123']).save();
    const team2 = await new Team('Another team', 456, 'Another new app', ['456']).save();

    // Team 1
    await judge.getNextTeam();
    expect(judge.currentTeam).toEqual(team1.id);

    await judge.continue();
    expect(judge.currentTeam).toBeNull();

    // Team 2
    await judge.getNextTeam();
    expect(judge.currentTeam).toEqual(team2.id);

    await judge.vote(true);
    expect(judge.currentTeam).toBeNull();

    // All teams visited
    await judge.getNextTeam();
    expect(judge.currentTeam).toBeNull();

    done();
  });

  it('judges will all get different teams if they exist', async (done) => {
    const numTeams = 20;
    const numJudges = 10;
    await createTeamData(numTeams);
    const judges = await createJudgeData(numJudges);

    const teamPromises = [];
    const teamsVisited: number[] = [];
    for (let i = 0; i < numJudges; i += 1) {
      const judge = judges[i];
      const promise = judge
        .getNextTeam()
        .then((team) => {
          teamsVisited.push(team.id);
          return judge.continue();
        })
        .then(() => judge.getNextTeam())
        .then((team) => {
          teamsVisited.push(team.id);
        });
      teamPromises.push(promise);
    }

    await Promise.all(teamPromises).then(() => {
      const uniqueTeams = Array.from(new Set(teamsVisited));
      expect(uniqueTeams.length).toEqual(numTeams);
      done();
    });
  });

  it('judging a team adds the currentTeam to visitedTeams', async (done) => {
    const judge = await new Judge().save();
    const team = await new Team('Some Team', 123, 'A new app', ['123']).save();

    await judge.getNextTeam();
    expect(judge.currentTeam).toEqual(team.id);

    await judge.continue();
    expect(judge.currentTeam).toBeNull();

    expect(judge.visitedTeams).toContain(team.id);
    done();
  });
});

describe('score calculation', () => {
  beforeAll(async () => {
    await createDbConnection();
  });

  afterAll(async () => {
    await closedbConnection();
  });

  it('teams are visited evenly', async (done) => {
    // Score 100 teams for 10 judges and make sure team visits are roughly the same
    // Create mock teams, sorted by performance (0 index == winner)
    const numTeams = 25;
    const numJudges = 10;
    const teams = await createTeamData(numTeams);
    const judges = await createJudgeData(numJudges);

    const percentVisitation = 0.7;

    let currJudgeIdx = 0;
    let allJudgesHaveContinued = false;

    for (let i = 0; i < percentVisitation * numTeams * numJudges; i += 1) {
      const judge = judges[currJudgeIdx];
      await judge.getNextTeam();

      // If necessary, continue before moving on
      if (!allJudgesHaveContinued) {
        await judge.continue();
        await judge.getNextTeam();
        if (currJudgeIdx === judges.length - 1) {
          allJudgesHaveContinued = true;
        }
      }

      // Prepare index for next loop
      if (currJudgeIdx === judges.length - 1) {
        currJudgeIdx = 0;
      } else {
        currJudgeIdx += 1;
      }

      // Evaluate teams for voting
      const previousTeamId = judge.getLastJudgedTeamId();
      let previousTeamIdx = Number.POSITIVE_INFINITY;
      let currentTeamIdx = 0;

      teams.forEach((t, index) => {
        if (t.id === previousTeamId) {
          previousTeamIdx = index;
        } else if (t.id === judge.currentTeam) {
          currentTeamIdx = index;
        }
      });

      // Vote using position in original array
      const currTeamChosen = currentTeamIdx < previousTeamIdx;
      await judge.vote(currTeamChosen);
    }

    // Now that judging has ended, validate results
    const judgedTeams = await Team.find();
    let min: number;
    let max: number;

    judgedTeams.forEach((judgedTeam) => {
      if (min === undefined || judgedTeam.judgeVisits < min) {
        min = judgedTeam.judgeVisits;
      }

      if (max === undefined || judgedTeam.judgeVisits > max) {
        max = judgedTeam.judgeVisits;
      }
    });

    expect(min).toBeGreaterThan(0);
    expect(max).toBeLessThan(judges.length);
    expect(max - min).toBeLessThanOrEqual(1);

    // TODO: Evaluate scoring

    done();
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
