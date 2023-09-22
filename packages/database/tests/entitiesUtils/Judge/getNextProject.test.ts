import { Project } from '../../../src';
import { getNextProject } from '../../../src/entitiesUtils';

describe('getNextProject', () => {
  it('queries for a project with the correct values', async () => {
    const mockEntityManager = {
      findOne: jest.fn(),
    };
    const excludedProjectIds = ['1'];
    await getNextProject({ entityManager: mockEntityManager as any, excludedProjectIds });

    expect(mockEntityManager.findOne).toHaveBeenCalledWith(
      Project,
      expect.objectContaining({ id: { $nin: excludedProjectIds } }),
      expect.objectContaining({
        lockMode: 2,
        orderBy: { judgeVisits: 'ASC', activeJudgeCount: 'ASC' },
      }),
    );
  });
});
