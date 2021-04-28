/* eslint-disable @typescript-eslint/no-explicit-any */
import 'jest';
import { UpdateResult, FindOneOptions } from 'typeorm';
import { Team } from '../../entities/team';

const findOneSpy = jest.spyOn(Team, 'findOne').mockImplementation();
const updateSelectedTeamSpy = jest.spyOn(Team, 'updateSelectedTeam').mockImplementation(async (team: Team, newHash: string) => {
  // eslint-disable-next-line no-param-reassign
  team.syncHash = newHash;
  return ({
    affected: 1,
  } as Partial<UpdateResult>) as UpdateResult;
});

let mockTeam: Team;

describe('getNextAvailableTeamExcludingTeams util method', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockTeam = new Team('Does this work?', 123, 'Databases are cool', ['123456']);
    mockTeam.reload = jest.fn();
  });

  it('should get the next available team when there are excluded teams', async () => {
    findOneSpy.mockResolvedValueOnce(mockTeam);
    const excludedTeamId = 1234;
    const nextTeam = await Team.getNextAvailableTeamExcludingTeams(excludedTeamId);

    expect(findOneSpy).toBeCalledTimes(1);
    expect(updateSelectedTeamSpy).toBeCalledTimes(1);
    const findOneOptions = findOneSpy.mock.calls[0][0] as FindOneOptions<Team>;
    // eslint-disable-next-line no-underscore-dangle
    expect((findOneOptions.where as any).id._value._value).toEqual([excludedTeamId]);
    expect(findOneOptions.order as any).toEqual({
      activeJudgeCount: 'ASC',
      judgeVisits: 'ASC',
    });
    expect(Object.keys(findOneOptions.order)).toEqual(['activeJudgeCount', 'judgeVisits']);
    expect(nextTeam.id).toEqual(mockTeam.id);
  });

  // it('should return the next available team when there are no excluded teams', async () => {
  //   findOneSpy.mockResolvedValueOnce(mockTeam);
  //   const nextTeam = await Team.getNextAvailableTeamExcludingTeams();

  //   expect(findOneSpy).toBeCalledTimes(1);
  //   expect(updateSelectedTeamSpy).toBeCalledTimes(1);
  //   const findOneOptions = findOneSpy.mock.calls[0][0] as FindOneOptions<Team>;
  //   // eslint-disable-next-line no-underscore-dangle
  //   expect(findOneOptions.where).toEqual({});
  //   expect(nextTeam.id).toEqual(mockTeam.id);
  // });

  it('retries getting next team 5 times and throws error', async () => {
    const unaffectedUpdateResponse = ({
      affected: 0,
    } as Partial<UpdateResult>) as UpdateResult;

    const retries = 5;
    for (let i = retries; i > 0; i -= 1) {
      findOneSpy.mockResolvedValueOnce(mockTeam);
      updateSelectedTeamSpy.mockResolvedValueOnce(unaffectedUpdateResponse);
    }

    await expect(Team.getNextAvailableTeamExcludingTeams(12345)).rejects.toThrowError();

    expect(findOneSpy).toBeCalledTimes(5);
    expect(updateSelectedTeamSpy).toBeCalledTimes(5);
  });

  it('returns null if team is null', async () => {
    findOneSpy.mockResolvedValueOnce(null);
    const newTeam = await Team.getNextAvailableTeamExcludingTeams(12345);
    expect(newTeam).toEqual(null);
  });
});
