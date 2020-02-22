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
      judge = await new Judge();
      team = await new Team('Some Team', 123, 'A new app', ['123']);

      await judge.save();
      await team.save();

      judge.currentTeam = team.id;
      team.activeJudgeCount = 1;

      await judge.save();
      await team.save();
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
});
