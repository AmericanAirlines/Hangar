/* eslint-disable max-lines */
import { ExpoJudgingVote, Judge, JudgeErrorCode } from '../../src';
import { createMockEntityManager } from '../testUtils/createMockEntityManager';

const mockProjectValues = {
  toReference: jest.fn(),
  incrementActiveJudgeCount: jest.fn(),
  incrementJudgeVisits: jest.fn(),
  getEntity: jest.fn().mockReturnThis(),
  decrementActiveJudgeCount: jest.fn(),
};

jest.mock('../../src/entities/ExpoJudgingVote', () => ({
  ExpoJudgingVote: jest.fn(),
}));

describe('Judge', () => {
  describe('continue', () => {
    it('successfully gets a new team, updates it, and persists all changes', async () => {
      const mockEntityManager = createMockEntityManager();
      const rootJudge = new Judge({ user: { id: '1' } as any });
      (rootJudge.id as any) = 1;

      // Mock the judge that gets locked
      const mockProject = { ...mockProjectValues };
      const mockExpoJudgingVotes = ['votes here'];
      const judge = {
        id: '2',
        getNextProject: jest.fn().mockResolvedValueOnce(mockProject),
        expoJudgingVotes: { getIdentifiers: jest.fn().mockReturnValueOnce(mockExpoJudgingVotes) },
      };
      mockEntityManager.findOne.mockResolvedValueOnce(judge);

      await rootJudge.continue({ entityManager: mockEntityManager as any });

      expect(mockEntityManager.transactional).toBeCalledTimes(1);
      expect(mockEntityManager.findOne).toBeCalledTimes(1);
      expect(mockEntityManager.findOne).toBeCalledWith(
        Judge,
        expect.objectContaining({ id: rootJudge.id }),
        expect.objectContaining({ populate: ['expoJudgingVotes'], lockMode: 4 }),
      );

      expect(judge.getNextProject).toHaveBeenCalledTimes(1);
      expect(judge.getNextProject).toHaveBeenCalledWith(
        expect.objectContaining({
          entityManager: mockEntityManager,
          excludedProjectIds: mockExpoJudgingVotes,
        }),
      );

      expect(mockProject.incrementActiveJudgeCount).toHaveBeenCalledTimes(1);
      expect(mockProject.incrementJudgeVisits).toHaveBeenCalledTimes(1);
      expect(mockEntityManager.persist).toBeCalledWith(judge);
    });
  });

  describe('skip', () => {
    it('skips the current team and does not assign them to the previous project', async () => {
      const mockEntityManager = createMockEntityManager();
      const rootJudge = new Judge({ user: { id: '1' } as any });
      (rootJudge.id as any) = 1;

      // Mock the judge that gets locked
      const mockProject = { ...mockProjectValues };
      const mockExpoJudgingVotes = ['votes here'];
      const mockOriginalCurrentProject = { ...mockProjectValues };
      const judge = {
        id: '2',
        getNextProject: jest.fn().mockResolvedValueOnce(mockProject),
        expoJudgingVotes: { getIdentifiers: jest.fn().mockReturnValueOnce(mockExpoJudgingVotes) },
        currentProject: mockOriginalCurrentProject,
        previousProject: undefined,
      };
      mockEntityManager.findOne.mockResolvedValueOnce(judge);

      await rootJudge.skip({ entityManager: mockEntityManager as any });
      expect(judge.currentProject).not.toEqual(mockOriginalCurrentProject);
      expect(judge.previousProject).toBeUndefined();
    });
  });

  describe('vote', () => {
    it('creates a new vote and persists it', async () => {
      const mockEntityManager = createMockEntityManager();
      const rootJudge = new Judge({ user: { id: '1' } as any });
      (rootJudge.id as any) = 1;

      // Mock the judge that gets locked
      const mockProject = { ...mockProjectValues };
      const mockProjectReference = 'next project';
      mockProject.toReference.mockReturnValueOnce(mockProjectReference);
      const mockExpoJudgingVotes = ['votes here'];
      const currentProject = { ...mockProjectValues };
      const judge = {
        id: '2',
        getNextProject: jest.fn().mockResolvedValueOnce(mockProject),
        expoJudgingVotes: { getIdentifiers: jest.fn().mockReturnValueOnce(mockExpoJudgingVotes) },
        previousProject: { ...mockProjectValues },
        currentProject,
        toReference: jest.fn(() => ({ id: '2' })),
      };
      mockEntityManager.findOne.mockResolvedValueOnce(judge);

      const mockVote = {};
      (ExpoJudgingVote.prototype.constructor as jest.Mock).mockReturnValueOnce(mockVote);

      const vote = await rootJudge.vote({
        entityManager: mockEntityManager as any,
        currentProjectChosen: true,
        expoJudgingSession: { toReference: jest.fn() } as any,
      });

      expect(vote).toBe(mockVote);
      expect(mockEntityManager.transactional).toBeCalledTimes(1);
      expect(mockEntityManager.findOne).toBeCalledTimes(1);
      expect(mockEntityManager.findOne).toBeCalledWith(
        Judge,
        expect.objectContaining({ id: rootJudge.id }),
        expect.objectContaining({ populate: ['expoJudgingVotes'], lockMode: 4 }),
      );

      expect(judge.getNextProject).toHaveBeenCalledTimes(1);
      expect(judge.getNextProject).toHaveBeenCalledWith(
        expect.objectContaining({
          entityManager: mockEntityManager,
          excludedProjectIds: mockExpoJudgingVotes,
        }),
      );
      expect(judge.previousProject).toBe(currentProject);
      expect(judge.currentProject).toBe(mockProjectReference);

      expect(mockProject.incrementActiveJudgeCount).toHaveBeenCalledTimes(1);
      expect(mockProject.incrementJudgeVisits).toHaveBeenCalledTimes(1);
      expect(mockEntityManager.persist).toBeCalledWith(judge);
      expect(mockEntityManager.persist).toBeCalledWith(mockVote);
    });
  });

  describe('releaseAndContinue errors', () => {
    it('throws an error if the judge lock cannot be obtained', async () => {
      const mockEntityManager = createMockEntityManager();
      const judge = new Judge({ user: { id: '1' } as any });
      (judge.id as any) = 1;

      // Don't return a judge (lock not obtained)
      mockEntityManager.findOne.mockResolvedValueOnce(null);

      await expect(
        judge.continue({ entityManager: mockEntityManager as any }),
      ).rejects.toThrowError(expect.objectContaining({ cause: JudgeErrorCode.UnableToLockJudge }));

      expect(mockEntityManager.transactional).toBeCalledTimes(1);
      expect(mockEntityManager.findOne).toBeCalledTimes(1);
    });

    describe('continue', () => {
      it('throws an error when the judge has a previous project', async () => {
        const mockEntityManager = createMockEntityManager();
        const judge = new Judge({ user: { id: '1' } as any });
        (judge.id as any) = 1;

        const mockJudge = { id: '2', previousProject: {} };
        mockEntityManager.findOne.mockResolvedValueOnce(mockJudge);

        await expect(
          judge.continue({ entityManager: mockEntityManager as any }),
        ).rejects.toThrowError(expect.objectContaining({ cause: JudgeErrorCode.CannotContinue }));

        expect(mockEntityManager.transactional).toBeCalledTimes(1);
        expect(mockEntityManager.findOne).toBeCalledTimes(1);
      });
    });

    describe('skip', () => {
      it('throws an error if there is not a current team to skip', async () => {
        const mockEntityManager = createMockEntityManager();
        const judge = new Judge({ user: { id: '1' } as any });
        (judge.id as any) = 1;

        const mockJudge = { id: '2' };
        mockEntityManager.findOne.mockResolvedValueOnce(mockJudge);

        await expect(judge.skip({ entityManager: mockEntityManager as any })).rejects.toThrowError(
          expect.objectContaining({ cause: JudgeErrorCode.CannotSkip }),
        );

        expect(mockEntityManager.transactional).toBeCalledTimes(1);
        expect(mockEntityManager.findOne).toBeCalledTimes(1);
      });
    });

    describe('vote', () => {
      it('throws an error for vote when the judge is missing a previous project', async () => {
        const mockEntityManager = createMockEntityManager();
        const judge = new Judge({ user: { id: '1' } as any });
        (judge.id as any) = 1;

        const mockJudge = { id: '2', currentProject: {} };
        mockEntityManager.findOne.mockResolvedValueOnce(mockJudge);

        const mockExpoJudgingSession = {} as any;

        await expect(
          judge.vote({
            entityManager: mockEntityManager as any,
            currentProjectChosen: true,
            expoJudgingSession: mockExpoJudgingSession,
          }),
        ).rejects.toThrowError(
          expect.objectContaining({ cause: JudgeErrorCode.MissingProjectForVote }),
        );
      });

      it('throws an error for vote when the judge is missing a current project', async () => {
        const mockEntityManager = createMockEntityManager();
        const judge = new Judge({ user: { id: '1' } as any });
        (judge.id as any) = 1;

        const mockJudge = { id: '2', previousProject: {} };
        mockEntityManager.findOne.mockResolvedValueOnce(mockJudge);

        const mockExpoJudgingSession = {} as any;

        await expect(
          judge.vote({
            entityManager: mockEntityManager as any,
            currentProjectChosen: true,
            expoJudgingSession: mockExpoJudgingSession,
          }),
        ).rejects.toThrowError(
          expect.objectContaining({ cause: JudgeErrorCode.MissingProjectForVote }),
        );
      });
    });
  });
});
