import 'jest';
import { createDbConnection, closeDbConnection } from '../testdb';
import { Team } from '../../entities/team';
import { Judge } from '../../entities/judge';
import { JudgingVote, insufficientVoteCountError } from '../../entities/judgingVote';
import logger from '../../logger';
import { createJudgeData, createTeamData, visitTeamsAndJudge } from '../utilities';

/* eslint-disable no-await-in-loop */

// Bump Jest timeout to accomodate tabulation test matrix
jest.setTimeout(15000);

describe('judging logistics', () => {
  beforeEach(async () => {
    await createDbConnection();
  });

  afterEach(async () => {
    await closeDbConnection();
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
    await closeDbConnection();
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

  it('scoring works as expected without judge volatility and full visitation', async (done) => {
    // TODO: Achieve 100% in tests with perfect judging
    const accuracyThreshold = 0.5;
    const overallAverageAccuracyThreshold = 0.75;
    // TODO: Add lower visitation
    const visitationSet = [1.0];
    const numTeamsSet = [5, 10, 15];
    const numJudgesSet = [5, 10, 15];

    let testCount = 0;
    let accuracySum = 0;
    const errors: string[] = [];

    await closeDbConnection();
    for (let k = 0; k < visitationSet.length; k += 1) {
      const visitation = visitationSet[k];
      for (let i = 0; i < numTeamsSet.length; i += 1) {
        const numTeams = numTeamsSet[i];
        for (let j = 0; j < numJudgesSet.length; j += 1) {
          testCount += 1;
          const numJudges = numJudgesSet[j];

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
          const accuracy = 1 - avgErrorDistance / expectedOrder.length;
          accuracySum += accuracy;

          const outputString = `Finished Scoring - ${numTeams} Teams x ${numJudges} Judges x ${(visitation * 100).toFixed(2)}% Visitation
    Accuracy: ${(accuracy * 100).toFixed(1)}%
    Errors: ${errorCount}`;

          if (accuracy < accuracyThreshold) {
            errors.push(
              `Scoring with ${numTeams} teams, ${numJudges} judges, and visitation of ${(visitation * 100).toFixed(
                1,
              )}% visitation failed to meet accuracy threshold of ${(accuracyThreshold * 100).toFixed(1)}% with ${(accuracy * 100).toFixed(1)}%`,
            );
            logger.error(outputString);
          } else {
            logger.info(outputString);
          }

          await closeDbConnection();
        }
      }
    }

    await createDbConnection();

    const overallAverageAccuracy = accuracySum / testCount;

    logger.info(`SCORING OVERVIEW
    Number of Tests: ${testCount}
    Average Accuracy: ${(overallAverageAccuracy * 100).toFixed(2)}%`);

    if (errors.length > 0) {
      throw new Error('At least one scoring tabulation failed');
      // throw new Error(`At least one scoring tabulation failed: \n\t${errors.join('\n\t')}`);
    }

    expect(overallAverageAccuracy).toBeGreaterThanOrEqual(overallAverageAccuracyThreshold);
    done();
  });

  it('judging scores should be between 0 and 100', async () => {
    const numTeams = 10;
    const numJudges = 10;
    const teams = await createTeamData(numTeams);
    const judges = await createJudgeData(numJudges);

    await visitTeamsAndJudge(judges, teams);

    const scores = await JudgingVote.tabulate();
    let previousScore = Number.POSITIVE_INFINITY;
    for (let i = 0; i < scores.length; i += 1) {
      const { score } = scores[i];
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
      expect(score).toBeLessThanOrEqual(previousScore);
      previousScore = score;
    }
  });

  it('tabulation will throw an error if no votes exist', async () => {
    try {
      await JudgingVote.tabulate();
      throw new Error('Expected method to throw');
    } catch (err) {
      expect(err.name).toBe(insufficientVoteCountError);
    }
  });
});
