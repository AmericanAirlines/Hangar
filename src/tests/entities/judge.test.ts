import 'jest';
import { createDbConnection, closeDbConnection } from '../testdb';
import { Judge } from '../../entities/judge';
import { Team } from '../../entities/team';

describe('judge entity', () => {
  beforeEach(async () => {
    await createDbConnection();
  });

  afterEach(async () => {
    await closeDbConnection();
  });

  describe('stepAway()', () => {
    let judge: Judge;
    let team: Team;

    beforeEach(async () => {
      team = await new Team('Some Team', 123, 'A new app', ['123']);
      team.activeJudgeCount = 1;
      await team.save();
      
      judge = await new Judge();
      judge.currentTeam = team.id;
      await judge.save();
    });

    it('should set the judge to away', async () => {
      judge = await judge.stepAway();

      expect(judge.away).toBe(true);
    });

    it('should reduce the active judge count for the team', async () => {
      await judge.stepAway();

      await team.reload();

      expect(team.activeJudgeCount).toBe(0);
    });

    describe('when judge is already away', () => {
      beforeEach(async () => {
        judge.away = true;
        await judge.save();
      });

      it('will not reduce the active judge count of team', async () => {
        await judge.stepAway();
        await team.reload();
        expect(team.activeJudgeCount).toBe(1);
      });
    });

    describe('when active judge count of team has less than 1', () => {
      beforeEach(async () => {
        team.activeJudgeCount = 0;
        await team.save();
      });

      it('should not set the judge to away', async () => {
        judge = await judge.stepAway();

        expect(judge.away).toBe(false);
      });

      it('should not reduce the active judge count of team', async () => {
        await judge.stepAway();

        await team.reload();
        expect(team.activeJudgeCount).toBe(0);
      });
    });
  });

  describe('resumeJudging()', () => {
    let judge: Judge;
    let team: Team;

    beforeEach(async () => {
      team = await new Team('Some Team', 123, 'A new app', ['123']);
      team.activeJudgeCount = 1;
      await team.save();
      
      judge = await new Judge();
      judge.currentTeam = team.id;
      judge.away = true;
      await judge.save();
    });

    it('increases the active judge count by one', async () => {
      await judge.resumeJudging();

      await team.reload();
      expect(team.activeJudgeCount).toBe(2);
    });

    it('does not increase the active judge count when not away', async () => {
      judge.away = false;
      await judge.save();
      await judge.resumeJudging();

      await team.reload();
      expect(team.activeJudgeCount).toBe(1);
    });
  });
});
