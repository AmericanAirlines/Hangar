import 'jest';
import shuffle from 'shuffle-array';
import { createDbConnection, closedbConnection } from './testdb';
import { Team } from '../entities/team';
import { Judge } from '../entities/judge';
import { JudgingVote } from '../entities/judgingVote';
import logger from '../logger';

/* eslint-disable no-await-in-loop, no-continue */

jest.setTimeout(10000);

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

  it('judging correctly increments and decrements team counters', async () => {
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
  });

  it('getNextTeam will only pull unvisited teams', async () => {
    const judge = await new Judge().save();
    const team1 = await new Team('Some Team', 123, 'A new app', ['123']).save();
    const team2 = await new Team('Another team', 456, 'Another new app', ['456']).save();

    await judge.getNextTeam();
    expect(judge.currentTeam).toEqual(team1.id);

    await judge.continue();
    expect(judge.currentTeam).toBeNull();

    await judge.getNextTeam();
    expect(judge.currentTeam).toEqual(team2.id);
  });

  it('current team will be null when all teams have been visted', async () => {
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
  });

  it('judging a team adds the currentTeam to visitedTeams', async () => {
    const judge = await new Judge().save();
    const team = await new Team('Some Team', 123, 'A new app', ['123']).save();

    await judge.getNextTeam();
    expect(judge.currentTeam).toEqual(team.id);

    await judge.continue();
    expect(judge.currentTeam).toBeNull();

    expect(judge.visitedTeams).toContain(team.id);

    const dbJudge = await Judge.findOne(judge.id);
    expect(dbJudge.visitedTeams).toEqual(judge.visitedTeams);
  });

  it('judges will all get different teams if they exist', async () => {
    const numTeams = 20;
    const numJudges = 10;
    await createTeamData(numTeams);
    const judges = await createJudgeData(numJudges);

    for (let i = 0; i < numJudges; i += 1) {
      const judge = judges[i];
      await judge
        .getNextTeam()
        .then(() => judge.continue())
        .then(() => judge.getNextTeam())
        .then(() => judge.continue());
    }

    let visitedTeams: number[] = [];
    for (let i = 0; i < numJudges; i += 1) {
      const judge = judges[i];
      visitedTeams = visitedTeams.concat(judge.visitedTeams);
    }
    const uniqueTeams = Array.from(new Set(visitedTeams));
    expect(uniqueTeams.length).toEqual(numTeams);
  });

  it('if a judge skips a team, they will be marked as being visited but will not be the previous team', async () => {
    const judge = await new Judge().save();
    const team1 = await new Team('Some Team', 123, 'A new app', ['123']).save();

    await judge.getNextTeam();
    expect(judge.currentTeam).toEqual(team1.id);

    const team2 = await new Team('Another Team', 456, 'A new app', ['456']).save();

    await judge.continue();
    await judge.getNextTeam();

    await judge.skip();

    expect(judge.currentTeam).toBeNull();
    expect(judge.previousTeam).toEqual(team1.id);
    expect(judge.visitedTeams).toContain(team1.id);
    expect(judge.visitedTeams).toContain(team2.id);
  });
});

describe('score calculation', () => {
  beforeEach(async () => {
    await createDbConnection();
  });

  afterEach(async () => {
    await closedbConnection();
  });

  it('if minimal data is provided, tabulation will throw an error', async () => {
    const numTeams = 7;
    const numJudges = 10;
    const teams = await createTeamData(numTeams);
    const judges = await createJudgeData(numJudges);

    await visitTeamsAndJudge(judges, teams, 0.2);
    await expect(JudgingVote.tabulate()).rejects.toThrow();

    await visitTeamsAndJudge(judges, teams);
    await expect(JudgingVote.tabulate()).resolves;
  });

  it('teams are visited evenly', async () => {
    const numTeams = 25;
    const numJudges = 10;
    const teams = await createTeamData(numTeams);
    const judges = await createJudgeData(numJudges);

    await visitTeamsAndJudge(judges, teams);

    // Now that judging has ended, validate results
    const judgedTeams = await Team.find();
    let minVisits: number;
    let maxVisits: number;

    judgedTeams.forEach((judgedTeam) => {
      if (minVisits === undefined || judgedTeam.judgeVisits < minVisits) {
        minVisits = judgedTeam.judgeVisits;
      }
      if (maxVisits === undefined || judgedTeam.judgeVisits > maxVisits) {
        maxVisits = judgedTeam.judgeVisits;
      }
    });

    expect(minVisits).toBeGreaterThan(0);
    expect(maxVisits).toBeLessThan(judges.length);
    expect(maxVisits - minVisits).toBeLessThanOrEqual(1);
  });

  it('scoring works as expected without judge volatility and full visitation', async () => {
    const similarityThreshold = 0.75;
    const numTeamsSet = [5, 10, 15];
    const numJudgesSet = [5, 10, 15];
    const visitationSet = [1.0];

    const errors: string[] = [];

    await closedbConnection();
    for (let i = 0; i < numTeamsSet.length; i += 1) {
      const numTeams = numTeamsSet[i];
      for (let j = 0; j < numJudgesSet.length; j += 1) {
        const numJudges = numJudgesSet[j];
        for (let k = 0; k < visitationSet.length; k += 1) {
          const visitation = visitationSet[k];


          await createDbConnection();

          const teams = await createTeamData(numTeams);
          const judges = await createJudgeData(numJudges);

          const orderedTeams = await visitTeamsAndJudge(judges, teams, visitation);

          const scores = await JudgingVote.tabulate();

          const expectedOrder = orderedTeams.map((team) => team.id);
          const scoredOrder = scores.map((score) => score.id);

          let errorCount = 0;
          let errorDistanceSum = 0;
          for (let l = 0; l < expectedOrder.length; l += 1) {
            if (expectedOrder[l] !== scoredOrder[l]) {
              errorCount += 1;
              errorDistanceSum += Math.abs(expectedOrder[l] - scoredOrder[l]);
            }
          }

          const avgErrorDistance = errorDistanceSum / expectedOrder.length;
          const similarity = 1 - avgErrorDistance / expectedOrder.length;

          const outputString = `Finished Scoring - ${numTeams} Teams x ${numJudges} Judges
    Similarity: ${(similarity * 100).toFixed(1)}%
    Errors: ${errorCount}`;

          if (similarity < similarityThreshold) {
            errors.push(`Scoring with ${numTeams} teams, ${numJudges} judges, and visitation of ${visitation * 100}% visitation failed to meet similarity threshold of ${(similarityThreshold * 100).toFixed(1)}% with ${(similarity * 100).toFixed(1)}%`);
            logger.error(outputString);
          } else {
            logger.info(outputString);
          }

          // TODO: Achieve 100% in tests with perfect judging
          // expect(similarity).toEqual(1);
          await closedbConnection();
        }
      }
    }

    if (errors.length > 0) {
      throw new Error(`At least one scoring tabulation failed: \n\t${errors.join('\n\t')}`);
    }

    await createDbConnection();
  });

  // it('scoring works as expected without judge volatility and minimal visitation', async () => {
  //   const numTeams = 12;
  //   const numJudges = 10;
  //   const teams = await createTeamData(numTeams);
  //   const judges = await createJudgeData(numJudges);

  //   const orderedTeams = await visitTeamsAndJudge(judges, teams, 0.6);

  //   const scores = await JudgingVote.tabulate();

  //   const expectedOrder = orderedTeams.flatMap((team) => team.id);
  //   const scoredOrder = scores.flatMap((score) => score.id);

  //   expect(scoredOrder).toEqual(expectedOrder);
  // });
});

/**
 * Use provided list of judges to judge the provided list of teams
 * @param judges - the array of judges used for judging
 * @param orderedTeams - the array of teams used for judging sorted in the order of highest score to lowest
 * @param percentVisitation - the percent of maximum visitation, where `(numTeams - 1) * numJudges` represents
 * the maximum number of possible visits
 */
async function visitTeamsAndJudge(judges: Judge[], teams: Team[], percentVisitation = 0.7): Promise<Team[]> {
  // Shuffle teams to mitigate issues with DB ordering impacting scoring
  const orderedTeams: Team[] = shuffle(Object.assign([], teams));
  let currJudgeIdx = 0;
  let allJudgesHaveContinued = false;

  for (let i = 0; i < percentVisitation * teams.length * judges.length; i += 1) {
    const judge = judges[currJudgeIdx];
    await judge.getNextTeam();
    if (!judge.currentTeam) {
      // Judge has run out of teams to pick from
      continue;
    }

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
    const previousTeamId = judge.previousTeam;
    let previousTeamIdx = Number.POSITIVE_INFINITY;
    let currentTeamIdx = 0;

    // Use the original, ordered list of teams to identify to determine which team should win
    orderedTeams.forEach((t, index) => {
      if (t.id === previousTeamId) {
        previousTeamIdx = index;
      } else if (t.id === judge.currentTeam) {
        currentTeamIdx = index;
      }
    });

    // TODO: Implement judge volatility
    const currTeamChosen = currentTeamIdx < previousTeamIdx;
    // console.log(`Judge ${judge.id} chose ${currTeamChosen ? currentTeamIdx : previousTeamIdx} over ${currTeamChosen ? previousTeamIdx : currentTeamIdx}`);
    await judge.vote(currTeamChosen);
  }
  return orderedTeams;
}

async function createTeamData(numTeams: number): Promise<Team[]> {
  const teams: Team[] = [];
  for (let i = 0; i < numTeams; i += 1) {
    const team = await new Team(`Team ${i}`, i, `Project for Team ${i}`, [String(i)]).save();
    teams.push(team);
  }
  return teams;
}

async function createJudgeData(numJudges: number): Promise<Judge[]> {
  const judges: Judge[] = [];
  for (let i = 0; i < numJudges; i += 1) {
    judges.push(await new Judge().save());
  }
  return judges;
}
