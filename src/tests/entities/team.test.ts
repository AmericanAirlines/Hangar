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

const mockMethod = jest.fn(
  (): Promise<UpdateResult> => {
    return Promise.resolve(result);
  },
);

const mockQueryBuilder = {
  where: jest.fn().mockReturnThis(),
  clone: jest.fn().mockReturnThis(),
  andWhere: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  addOrderBy: jest.fn().mockReturnThis(),
  getOne: jest.fn().mockReturnThis(),
};

describe('', () => {
  let team = new Team('Does this work?', 123, 'Databases are cool', ['123456']);

  beforeEach(() => {
    jest.clearAllMocks();
    team.reload = jest.fn();
  });

  it('decrement active judge count', async () => {
    team.activeJudgeCount = 2;
    mockCreateQueryBuilder.execute = jest.fn(() => {
      team.activeJudgeCount = 1;
    });
    await team.decrementActiveJudgeCount();
    expect(createQuerySpy).toBeCalledTimes(1);
    expect(createQuerySpy).toBeCalledWith('team');
    expect(team.activeJudgeCount).toEqual(1);
  });

  it('increment judge visits', async () => {
    team.judgeVisits = 1;
    mockCreateQueryBuilder.execute = jest.fn(() => {
      team.judgeVisits = 2;
    });
    await team.incrementJudgeVisits();
    expect(createQuerySpy).toBeCalledTimes(1);
    expect(createQuerySpy).toBeCalledWith('team');
    expect(team.judgeVisits).toEqual(2);
  });

  it('updates selected teams', async () => {
    const result: UpdateResult = {
      affected: 0,
      raw: undefined,
      generatedMaps: undefined,
    };
    mockCreateQueryBuilder.execute = jest.fn(
      (): Promise<UpdateResult> => {
        return Promise.resolve(result);
      },
    );
    const response = await Team.updateSelectedTeam(team, '123');
    expect(createQuerySpy).toBeCalledTimes(1);
    expect(response).toEqual(result);
  });

  it('getting next avaiable team when there are no excluding teams', async () => {
    result.affected = 1;
    mockQueryBuilder.getOne = jest.fn(() => {
      return team;
    });
    Team.updateSelectedTeam = mockMethod;
    mockCreateQueryBuilder.select = jest.fn(() => {
      return mockQueryBuilder;
    });
    let newTeam: Team;
    newTeam = await Team.getNextAvailableTeamExcludingTeams([]);

    expect(newTeam).toEqual(team);
  });

  it('getting next avaiable team when there are excluding teams', async () => {
    result.affected = 1;
    mockQueryBuilder.getOne = jest.fn(() => {
      return team;
    });
    Team.updateSelectedTeam = mockMethod;
    mockCreateQueryBuilder.select = jest.fn(() => {
      return mockQueryBuilder;
    });

    let newTeam: Team;
    newTeam = await Team.getNextAvailableTeamExcludingTeams([4]);
    expect(newTeam).toEqual(team);
  });

  it('retries getting next team 5 times and throws error', async () => {
    result.affected = 0;
    mockQueryBuilder.getOne = jest.fn(() => {
      return team;
    });
    Team.updateSelectedTeam = mockMethod;
    mockCreateQueryBuilder.select = jest.fn(() => {
      return mockQueryBuilder;
    });

    let newTeam: Team;
    try {
      newTeam = await Team.getNextAvailableTeamExcludingTeams([]);
    } catch (err) {}
    expect(mockMethod).toBeCalledTimes(5);
  });

  it('returns null if team is null', async () => {
    result.affected = 0;
    mockQueryBuilder.getOne = jest.fn(() => {
      return null;
    });
    Team.updateSelectedTeam = mockMethod;
    mockCreateQueryBuilder.select = jest.fn(() => {
      return mockQueryBuilder;
    });

    let newTeam: Team;
    newTeam = await Team.getNextAvailableTeamExcludingTeams([]);
    expect(newTeam).toEqual(null);
  });
});
