import { Judge } from '../../src';
import { createMockEntityManager } from '../testUtils/createMockEntityManager';

describe('Judge', () => {
  describe('continue', () => {
    it('successfully gets a new team, updates it, and persists all changes', async () => {
      const mockEntityManager = createMockEntityManager();
      const judge = new Judge({ user: { id: '1' } as any });

      // Mock the judge that gets locked
      const mockJudge = { id: '2' };
      mockEntityManager.findOne.mockResolvedValueOnce(mockJudge);

      // Mock the project that gets picked next
      const mockGetNextProject = jest.fn();
      judge.getNextProject = mockGetNextProject;
      const mockProject = {
        toReference: jest.fn(),
        incrementActiveJudgeCount: jest.fn(),
        incrementJudgeVisits: jest.fn(),
      };
      mockGetNextProject.mockResolvedValueOnce(mockProject);

      const mockExpoJudgingVotes = ['votes here'];
      (judge.expoJudgingVotes.getIdentifiers as any) = jest
        .fn()
        .mockReturnValueOnce(mockExpoJudgingVotes);

      await judge.continue({ entityManager: mockEntityManager as any });

      expect(mockEntityManager.transactional).toBeCalledTimes(1);
      expect(mockEntityManager.findOne).toBeCalledTimes(1);
      expect(mockEntityManager.findOne).toBeCalledWith(
        Judge,
        expect.objectContaining({}),
        expect.objectContaining({}),
      );

      expect(mockGetNextProject).toHaveBeenCalledTimes(1);
      expect(mockGetNextProject).toHaveBeenCalledWith(
        expect.objectContaining({
          entityManager: mockEntityManager,
          excludedProjectIds: mockExpoJudgingVotes,
        }),
      );

      expect(mockProject.incrementActiveJudgeCount).toHaveBeenCalledTimes(1);
      expect(mockProject.incrementJudgeVisits).toHaveBeenCalledTimes(1);
      expect(mockEntityManager.persist).toBeCalledWith(judge);
    });

    it('throws an error when a previous project exists', () => {});
  });

  describe('skip', () => {});

  describe('vote', () => {});

  describe('releaseAndContinue errors', () => {
    it('throws an error if the judge lock cannot be obtained', () => {});
    it('throws an error for continue when the judge has a previous project', () => {});

    it('throws an error for vote when the judge is missing a previous project', () => {});

    it('throws an error for vote when the judge is missing a current project', () => {});
  });
});
