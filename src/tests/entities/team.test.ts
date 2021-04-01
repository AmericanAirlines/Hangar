import 'jest';
import { UpdateResult, SelectQueryBuilder } from 'typeorm';
import { Team } from '../../entities/team';

/* eslint-disable no-await-in-loop */
const mockCreateQueryBuilder = {
  update: jest.fn().mockReturnThis(),
  set: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  whereInIds: jest.fn().mockReturnThis(),
  andWhere: jest.fn().mockReturnThis(),
  execute: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
};
const createQuerySpy = jest
  .spyOn(Team, 'createQueryBuilder')
  .mockReturnValue((mockCreateQueryBuilder as Partial<SelectQueryBuilder<Team>>) as SelectQueryBuilder<Team>);

const result: UpdateResult = {
  affected: 0,
  raw: undefined,
  generatedMaps: undefined,
};

const mockMethod = jest.fn((): Promise<UpdateResult> => Promise.resolve(result));

const mockQueryBuilder = {
  where: jest.fn().mockReturnThis(),
  clone: jest.fn().mockReturnThis(),
  andWhere: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  addOrderBy: jest.fn().mockReturnThis(),
  getOne: jest.fn().mockReturnThis(),
};

describe('team', () => {
  const team = new Team('Does this work?', 123, 'Databases are cool', ['123456']);

  beforeEach(() => {
    jest.clearAllMocks();
    team.reload = jest.fn();
  });

  it('decrement active judge count', async () => {
    const execute = jest.fn();
    const where = jest.fn(() => ({ execute }));
    const set = jest.fn(() => ({ where }));
    mockCreateQueryBuilder.update = jest.fn(() => ({ set }));

    await team.decrementActiveJudgeCount();

    expect(createQuerySpy).toBeCalledWith('team');
    // expect(set).toBeCalledWith({ activeJudgeCount: () => '"team"."activeJudgeCount" - 1' });
    expect(where).toBeCalledWith('"team"."id" = :id AND "team"."activeJudgeCount" > 0', { id: team.id });
  });

  it('increment judge visits', async () => {
    const execute = jest.fn();
    const where = jest.fn(() => ({ execute }));
    const set = jest.fn(() => ({ where }));
    mockCreateQueryBuilder.update = jest.fn(() => ({ set }));

    await team.incrementJudgeVisits();

    expect(createQuerySpy).toBeCalledWith('team');
    // expect(set).toBeCalledWith({ judgeVisits: () => '"team"."judgeVisits" + 1' });
    expect(where).toBeCalledWith('"team"."id" = :id', { id: team.id });
  });

  it('updates selected teams', async () => {
    const execute = jest.fn();
    const andWhere = jest.fn(() => ({ execute }));
    const whereInIds = jest.fn(() => ({ andWhere }));
    const set = jest.fn(() => ({ whereInIds }));
    mockCreateQueryBuilder.update = jest.fn(() => ({ set }));

    team.syncHash = '123';

    await Team.updateSelectedTeam(team, team.syncHash);

    // expect(set).toBeCalledWith({ activeJudgeCount: team.activeJudgeCount + 1, syncHash: team.syncHash });
    expect(whereInIds).toBeCalledWith(team.id);
    expect(andWhere).toBeCalledWith('syncHash = :syncHash', { syncHash: team.syncHash });
  });

  it('getting next avaiable team when there are no excluding teams', async () => {
    result.affected = 1;
    mockQueryBuilder.getOne = jest.fn(() => team);
    Team.updateSelectedTeam = mockMethod;
    mockCreateQueryBuilder.select = jest.fn(() => mockQueryBuilder);

    const newTeam = await Team.getNextAvailableTeamExcludingTeams([]);

    expect(newTeam).toEqual(team);
  });

  it('getting next avaiable team when there are excluding teams', async () => {
    result.affected = 1;
    mockQueryBuilder.getOne = jest.fn(() => team);
    Team.updateSelectedTeam = mockMethod;
    mockCreateQueryBuilder.select = jest.fn(() => mockQueryBuilder);

    const newTeam = await Team.getNextAvailableTeamExcludingTeams([4]);
    expect(newTeam).toEqual(team);
  });

  it('retries getting next team 5 times and throws error', async () => {
    result.affected = 0;
    mockQueryBuilder.getOne = jest.fn(() => team);
    Team.updateSelectedTeam = mockMethod;
    mockCreateQueryBuilder.select = jest.fn(() => mockQueryBuilder);

    try {
      await Team.getNextAvailableTeamExcludingTeams([]);
    } catch (err) {
      // mockmethod should be called 5 times
    }
    expect(mockMethod).toBeCalledTimes(5);
  });

  it('returns null if team is null', async () => {
    result.affected = 0;
    mockQueryBuilder.getOne = jest.fn(() => null);
    Team.updateSelectedTeam = mockMethod;
    mockCreateQueryBuilder.select = jest.fn(() => mockQueryBuilder);

    const newTeam = await Team.getNextAvailableTeamExcludingTeams([]);
    expect(newTeam).toEqual(null);
  });
});
