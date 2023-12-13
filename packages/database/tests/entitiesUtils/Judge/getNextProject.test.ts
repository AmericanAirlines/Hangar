import { ExpoJudgingVote, Project } from '../../../src';
import { getNextProject } from '../../../src/entitiesUtils';

const mockJudge = {
  id: '123',
};

const mockProjectsForSession = ['1', '2', '3', '4'];
const mockProjectsForSessionCollection = {
  getIdentifiers: jest.fn().mockReturnValue(mockProjectsForSession),
};
const mockExpoJudgingSession = {
  projects: { load: jest.fn().mockResolvedValue(mockProjectsForSessionCollection) },
  id: '2',
};

const mockEntityManager = {
  find: jest.fn().mockResolvedValue([]),
  findOneOrFail: jest.fn(),
};

describe('getNextProject', () => {
  it('queries for a project with the correct values', async () => {
    const mockProjectData = [
      { id: '1', activeJudgeCount: 0 }, // 1 vote
      { id: '2', activeJudgeCount: 0 }, // 1 vote
      { id: '3', activeJudgeCount: 1 }, // No votes
      { id: '4', activeJudgeCount: 0 }, // No votes; should be next project
    ] as const;

    const mockVotes = [
      {
        previousProject: { $: { id: mockProjectData[0].id } },
        currentProject: { $: { id: mockProjectData[1].id } },
      },
    ] as const;

    const excludedProjectIds = ['1'];

    // Because the two calls are independent of each other,
    // create implementation to return the correct data for each call
    const returnProjectsOrVotes = async (entityClass: any) => {
      if (entityClass === Project) {
        return mockProjectData;
      }
      return mockVotes;
    };
    mockEntityManager.find
      .mockImplementationOnce(returnProjectsOrVotes)
      .mockImplementationOnce(returnProjectsOrVotes);

    await getNextProject({
      judge: mockJudge as any,
      entityManager: mockEntityManager as any,
      excludedProjectIds,
      expoJudgingSession: mockExpoJudgingSession as any,
    });

    expect(mockEntityManager.find).toHaveBeenCalledWith(
      Project,
      expect.objectContaining({ id: { $nin: excludedProjectIds, $in: mockProjectsForSession } }),
      expect.objectContaining({ fields: ['id', 'activeJudgeCount'] }),
    );

    expect(mockEntityManager.find).toHaveBeenCalledWith(
      ExpoJudgingVote,
      expect.objectContaining({ judgingSession: mockExpoJudgingSession.id }),
      expect.objectContaining({ fields: ['currentProject.id', 'previousProject.id'] }),
    );

    expect(mockEntityManager.findOneOrFail).toHaveBeenCalledWith(
      Project,
      expect.objectContaining({ id: '4' }), // Project with the least votes and active judges
    );
  });

  it('shuffles the projects and returns the first shuffled project when none have votes', async () => {
    const mockProjectData = [
      { id: '1', activeJudgeCount: 0 },
      { id: '2', activeJudgeCount: 0 },
      { id: '3', activeJudgeCount: 0 },
    ] as const;

    const mockVotes = [] as const;

    const excludedProjectIds = ['1'];

    // Because the two calls are independent of each other,
    // create implementation to return the correct data for each call
    const returnProjectsOrVotes = async (entityClass: any) => {
      if (entityClass === Project) {
        return mockProjectData;
      }
      return mockVotes;
    };
    mockEntityManager.find
      .mockImplementationOnce(returnProjectsOrVotes)
      .mockImplementationOnce(returnProjectsOrVotes);

    await getNextProject({
      judge: mockJudge as any,
      entityManager: mockEntityManager as any,
      excludedProjectIds,
      expoJudgingSession: mockExpoJudgingSession as any,
    });

    expect(mockEntityManager.findOneOrFail).toHaveBeenCalledWith(
      Project,
      expect.objectContaining({ id: '2' }), // Random project based on seed
    );
  });

  it('returns null if no remaining projects exist', async () => {
    const nextProject = await getNextProject({
      judge: mockJudge as any,
      entityManager: mockEntityManager as any,
      excludedProjectIds: [],
      expoJudgingSession: mockExpoJudgingSession as any,
    });
    expect(nextProject).toBe(null);
  });
});
