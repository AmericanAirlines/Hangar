import 'jest';
import { UpdateResult, SelectQueryBuilder, FindOneOptions } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { Team } from '../../entities/team';

/* eslint-disable no-await-in-loop */
const mockCreateQueryBuilder = {
  where: jest.fn().mockReturnThis(),
  clone: jest.fn().mockReturnThis(),
  andWhere: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  addOrderBy: jest.fn().mockReturnThis(),
  getOne: jest.fn().mockReturnThis(),
  set: jest.fn().mockReturnThis(),
  execute: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  whereInIds: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
};
const createQuerySpy = jest
  .spyOn(Team, 'createQueryBuilder')
  .mockReturnValue((mockCreateQueryBuilder as Partial<SelectQueryBuilder<Team>>) as SelectQueryBuilder<Team>);

const findOneSpy = jest.spyOn(Team, 'findOne').mockImplementation();
const updateSelectedTeamSpy = jest.spyOn(Team, 'updateSelectedTeam');

const result: UpdateResult = {
  affected: 0,
  raw: undefined,
  generatedMaps: undefined,
};

const mockMethod = jest.fn((): Promise<UpdateResult> => Promise.resolve(result));

let team: Team;

describe('team entity', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    team = new Team('Does this work?', 123, 'Databases are cool', ['123456']);
    team.reload = jest.fn();
    updateSelectedTeamSpy.mockRestore();
  });

  it('decrements active judge count', async () => {
    await team.decrementActiveJudgeCount();

    expect(createQuerySpy).toBeCalledWith('team');
    expect(mockCreateQueryBuilder.update).toBeCalledTimes(1);
    expect(mockCreateQueryBuilder.set).toBeCalledTimes(1);
    const { activeJudgeCount } = mockCreateQueryBuilder.set.mock.calls[0][0] as { activeJudgeCount: () => string };
    expect(activeJudgeCount()).toBe('"team"."activeJudgeCount" - 1');
    expect(mockCreateQueryBuilder.where).toBeCalledWith('"team"."id" = :id AND "team"."activeJudgeCount" > 0', { id: team.id });
    expect(mockCreateQueryBuilder.execute).toBeCalledTimes(1);
  });

  it('increments judge visits', async () => {
    await team.incrementJudgeVisits();

    expect(createQuerySpy).toBeCalledWith('team');
    expect(mockCreateQueryBuilder.set).toBeCalledTimes(1);
    const { judgeVisits } = mockCreateQueryBuilder.set.mock.calls[0][0] as { judgeVisits: () => string };
    expect(judgeVisits()).toBe('"team"."judgeVisits" + 1');
    expect(mockCreateQueryBuilder.where).toBeCalledWith('"team"."id" = :id', { id: team.id });
  });

  it('updates selected teams', async () => {
    team.syncHash = '123';

    await Team.updateSelectedTeam(team, team.syncHash);

    expect(mockCreateQueryBuilder.set).toBeCalledWith({ activeJudgeCount: team.activeJudgeCount + 1, syncHash: team.syncHash });
    expect(mockCreateQueryBuilder.whereInIds).toBeCalledWith(team.id);
    expect(mockCreateQueryBuilder.andWhere).toBeCalledWith('syncHash = :syncHash', { syncHash: team.syncHash });
  });

  it('should get the next avaiable team when there are excluded teams', async () => {
    findOneSpy.mockResolvedValueOnce(team);
    updateSelectedTeamSpy.mockImplementation(async (team: Team, newHash: string) => {
      team.syncHash = newHash;
      return ({
        affected: 1,
      } as Partial<UpdateResult>) as UpdateResult;
    });
    const excludedTeamId = 1234;
    const nextTeam = await Team.getNextAvailableTeamExcludingTeams([excludedTeamId]);
    expect(findOneSpy).toBeCalledTimes(1);
    const findOneOptions = findOneSpy.mock.calls[0][0] as FindOneOptions<Team>;
    expect((findOneOptions.where as any).id._value._value).toEqual([excludedTeamId]);
    expect(findOneOptions.order as any).toEqual({
      activeJudgeCount: 'ASC',
      judgeVisits: 'ASC',
    });
    expect(Object.keys(findOneOptions.order)).toEqual(['activeJudgeCount', 'judgeVisits']);
  });

  // it('should return the next available team when there are no excluded teams', async () => {
  //   result.affected = 1;
  //   Team.updateSelectedTeam = mockMethod;

  //   const newTeam = await Team.getNextAvailableTeamExcludingTeams();
  //   expect(mockCreateQueryBuilder.select).toBeCalledTimes(1);
  //   expect(mockCreateQueryBuilder.clone).toBeCalledTimes(1);
  //   expect(mockCreateQueryBuilder.select).toBeCalledTimes(1);
  //   expect(mockCreateQueryBuilder.select).toBeCalledTimes(1);

  //   expect(newTeam).toEqual(team);
  // });

  // it('retries getting next team 5 times and throws error', async () => {
  //   result.affected = 0;
  //   mockQueryBuilder.getOne = jest.fn(() => team);
  //   Team.updateSelectedTeam = mockMethod;
  //   mockCreateQueryBuilder.select = jest.fn(() => mockQueryBuilder);

  //   try {
  //     await Team.getNextAvailableTeamExcludingTeams([]);
  //   } catch (err) {
  //     // mockmethod should be called 5 times
  //   }
  //   expect(mockMethod).toBeCalledTimes(5);
  // });

  // it('returns null if team is null', async () => {
  //   result.affected = 0;
  //   mockQueryBuilder.getOne = jest.fn(() => null);
  //   Team.updateSelectedTeam = mockMethod;
  //   mockCreateQueryBuilder.select = jest.fn(() => mockQueryBuilder);

  //   const newTeam = await Team.getNextAvailableTeamExcludingTeams([]);
  //   expect(newTeam).toEqual(null);
  // });
});
