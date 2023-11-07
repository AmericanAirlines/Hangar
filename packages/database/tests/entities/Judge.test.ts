/* eslint-disable max-lines */
import { ref } from '@mikro-orm/core';
import { ExpoJudgingSessionContext, ExpoJudgingVote, Judge, JudgeErrorCode } from '../../src';
import { createMockEntityManager } from '../testUtils/createMockEntityManager';

const mockProjectValues = {
  id: '1',
  incrementActiveJudgeCount: jest.fn(),
  incrementJudgeVisits: jest.fn(),
  $: jest.fn().mockReturnThis(),
  decrementActiveJudgeCount: jest.fn(),
  load: jest.fn().mockReturnThis(),
};

jest.mock('../../src/entities/ExpoJudgingVote', () => ({
  ExpoJudgingVote: jest.fn(),
}));

describe('Judge', () => {
  describe('continue', () => {
    it('successfully gets a new project, updates it, and persists all changes', async () => {
      const mockEntityManager = createMockEntityManager();
      const rootJudge = new Judge({ user: { id: '1' } as any });
      (rootJudge.id as any) = '1';
      const mockProject = { ...mockProjectValues };
      const mockExpoJudgingSession = { id: '5' };
      Judge.getNextProject = jest.fn().mockResolvedValueOnce(mockProject);
      const mockExpoJudgingVotes = [
        {
          currentProject: { id: '5' },
          previousProject: { id: '5' },
          judgingSession: mockExpoJudgingSession,
        },
      ];
      (rootJudge.expoJudgingVotes as any) = {
        getItems: jest.fn().mockReturnValueOnce(mockExpoJudgingVotes),
        load: jest.fn(),
      };

      // Mock the judge that gets locked
      const context = {
        id: '2',
      };
      mockEntityManager.findOne.mockResolvedValueOnce(context);

      await rootJudge.continue({
        entityManager: mockEntityManager as any,
        expoJudgingSession: mockExpoJudgingSession as any,
      });

      expect(mockEntityManager.transactional).toBeCalledTimes(1);
      expect(mockEntityManager.findOne).toBeCalledTimes(1);
      expect(mockEntityManager.findOne).toBeCalledWith(
        ExpoJudgingSessionContext,
        expect.objectContaining({
          judge: rootJudge.id,
          expoJudgingSession: mockExpoJudgingSession.id,
        }),
        expect.objectContaining({ lockMode: 4 }),
      );

      expect(Judge.getNextProject).toHaveBeenCalledTimes(1);
      expect(Judge.getNextProject).toHaveBeenCalledWith(
        expect.objectContaining({
          entityManager: mockEntityManager,
          excludedProjectIds: [
            mockExpoJudgingVotes[0]?.currentProject.id, // Duplicate-free
          ],
        }),
      );
      // It only includes relevant votes
      expect(rootJudge.expoJudgingVotes.load).toBeCalledWith(
        expect.objectContaining({ where: { judgingSession: mockExpoJudgingSession.id } }),
      );

      expect(mockProject.incrementActiveJudgeCount).toHaveBeenCalledTimes(1);
      expect(mockProject.incrementJudgeVisits).toHaveBeenCalledTimes(1);
      expect(mockEntityManager.persist).toBeCalledWith(context);
    });
  });

  describe('skip', () => {
    it('skips the current project and does not assign them to the previous project', async () => {
      const mockEntityManager = createMockEntityManager();
      const rootJudge = new Judge({ user: { id: '1' } as any });
      (rootJudge.id as any) = '1';
      const mockProject = { ...mockProjectValues };
      Judge.getNextProject = jest.fn().mockResolvedValueOnce(mockProject);
      (rootJudge.expoJudgingVotes as any) = {
        getItems: jest.fn().mockReturnValueOnce([]),
        load: jest.fn(),
      };

      // Mock the judge that gets locked
      const mockOriginalCurrentProject = { ...mockProjectValues };
      const context = {
        id: '2',
        currentProject: mockOriginalCurrentProject,
        previousProject: undefined,
      };
      mockEntityManager.findOne.mockResolvedValueOnce(context);

      await rootJudge.skip({
        entityManager: mockEntityManager as any,
        expoJudgingSession: { id: '5' } as any,
      });

      expect(context.currentProject).not.toEqual(mockOriginalCurrentProject);
      expect(context.previousProject).toBeUndefined();
      expect(Judge.getNextProject).toHaveBeenCalledWith(
        expect.objectContaining({
          entityManager: mockEntityManager,
          excludedProjectIds: [
            mockOriginalCurrentProject.id, // Also ignores the current project if it exists
          ],
        }),
      );
    });

    it('updates the currentProject to be undefined when no remaining projects can be found', async () => {});
  });

  describe('vote', () => {
    it('creates a new vote and persists it', async () => {
      const mockEntityManager = createMockEntityManager();
      const rootJudge = new Judge({ user: { id: '1' } as any });
      (rootJudge.id as any) = '1';
      const mockProject = { ...mockProjectValues };
      Judge.getNextProject = jest.fn().mockResolvedValueOnce(mockProject);
      (rootJudge.expoJudgingVotes as any) = {
        getItems: jest.fn().mockReturnValueOnce([]),
        load: jest.fn(),
      };

      // Mock the judge that gets locked
      const currentProject = { ...mockProjectValues };
      const context = {
        id: '2',
        previousProject: { ...mockProjectValues },
        currentProject,
      };
      mockEntityManager.findOne.mockResolvedValueOnce(context);

      const mockVote = {};
      (ExpoJudgingVote.prototype.constructor as jest.Mock).mockReturnValueOnce(mockVote);
      const mockExpoJudgingSession = { id: '5' };

      const vote = await rootJudge.vote({
        entityManager: mockEntityManager as any,
        currentProjectChosen: true,
        expoJudgingSession: mockExpoJudgingSession as any,
      });

      expect(vote).toBe(mockVote);
      expect(mockEntityManager.transactional).toBeCalledTimes(1);
      expect(mockEntityManager.findOne).toBeCalledTimes(1);
      expect(mockEntityManager.findOne).toBeCalledWith(
        ExpoJudgingSessionContext,
        expect.objectContaining({
          judge: rootJudge.id,
          expoJudgingSession: mockExpoJudgingSession.id,
        }),
        expect.objectContaining({ lockMode: 4 }),
      );

      expect(Judge.getNextProject).toHaveBeenCalledTimes(1);
      expect(Judge.getNextProject).toHaveBeenCalledWith(
        expect.objectContaining({
          entityManager: mockEntityManager,
        }),
      );
      expect(context.previousProject).toBe(currentProject);
      expect(context.currentProject).toEqual(ref(currentProject));

      expect(mockProject.incrementActiveJudgeCount).toHaveBeenCalledTimes(1);
      expect(mockProject.incrementJudgeVisits).toHaveBeenCalledTimes(1);
      expect(mockEntityManager.persist).toBeCalledWith(context);
      expect(mockEntityManager.persist).toBeCalledWith(mockVote);
    });
  });

  describe('releaseAndContinue errors', () => {
    it('throws an error if the judge lock cannot be obtained', async () => {
      const mockEntityManager = createMockEntityManager();
      const judge = new Judge({ user: { id: '1' } as any });
      (judge.id as any) = '1';

      // Don't return a judge (lock not obtained)
      mockEntityManager.findOne.mockResolvedValueOnce(null);

      await expect(
        judge.continue({ entityManager: mockEntityManager as any, expoJudgingSession: {} as any }),
      ).rejects.toThrowError(expect.objectContaining({ cause: JudgeErrorCode.UnableToLockJudge }));

      expect(mockEntityManager.transactional).toBeCalledTimes(1);
      expect(mockEntityManager.findOne).toBeCalledTimes(1);
    });

    describe('continue', () => {
      it('throws an error when the judge has a previous project', async () => {
        const mockEntityManager = createMockEntityManager();
        const judge = new Judge({ user: { id: '1' } as any });
        (judge.id as any) = '1';

        const mockJudge = { id: '2', previousProject: {} };
        mockEntityManager.findOne.mockResolvedValueOnce(mockJudge);

        await expect(
          judge.continue({
            entityManager: mockEntityManager as any,
            expoJudgingSession: {} as any,
          }),
        ).rejects.toThrowError(expect.objectContaining({ cause: JudgeErrorCode.CannotContinue }));

        expect(mockEntityManager.transactional).toBeCalledTimes(1);
        expect(mockEntityManager.findOne).toBeCalledTimes(1);
      });
    });

    describe('skip', () => {
      it('throws an error if there is not a current project to skip', async () => {
        const mockEntityManager = createMockEntityManager();
        const judge = new Judge({ user: { id: '1' } as any });
        (judge.id as any) = '1';

        const mockJudge = { id: '2' };
        mockEntityManager.findOne.mockResolvedValueOnce(mockJudge);

        await expect(
          judge.skip({ entityManager: mockEntityManager as any, expoJudgingSession: {} as any }),
        ).rejects.toThrowError(expect.objectContaining({ cause: JudgeErrorCode.CannotSkip }));

        expect(mockEntityManager.transactional).toBeCalledTimes(1);
        expect(mockEntityManager.findOne).toBeCalledTimes(1);
      });
    });

    describe('vote', () => {
      it('throws an error for vote when the judge is missing a previous project', async () => {
        const mockEntityManager = createMockEntityManager();
        const judge = new Judge({ user: { id: '1' } as any });
        (judge.id as any) = '1';

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
        (judge.id as any) = '1';

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
