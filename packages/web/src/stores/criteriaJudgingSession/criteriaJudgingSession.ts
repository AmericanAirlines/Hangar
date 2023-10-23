import { CriteriaJudgingSession, wait } from '@hangar/shared';
import { create } from 'zustand';
import { fetchCriteriaJudgingSessions } from './fetchCriteriaJudgingSessions';
import { createCriteriaJudgingSession } from './createCriteriaJudgingSession';

type CriteriaJudgingSessionStore = {
  criteriaJudgingSessions?: CriteriaJudgingSession[];
  doneLoading: boolean;
  fetchCriteriaJudgingSessions: () => Promise<void>;
  addCriteriaJudgingSession: (
    ...args: Parameters<typeof createCriteriaJudgingSession>
  ) => Promise<void>;
};

export const useCriteriaJudgingSessionStore = create<CriteriaJudgingSessionStore>((set) => ({
  criteriaJudgingSessions: undefined,
  doneLoading: false,
  fetchCriteriaJudgingSessions: async () => {
    const [criteriaJudgingSessions] = await Promise.all([
      fetchCriteriaJudgingSessions(),
      wait(1000),
    ]);
    set({
      criteriaJudgingSessions,
      doneLoading: true,
    });
  },
  addCriteriaJudgingSession: async (...args) => {
    const newCriteriaJudgingSession = await createCriteriaJudgingSession(...args);

    if (newCriteriaJudgingSession) {
      set((state) => ({
        criteriaJudgingSessions: [
          ...(state.criteriaJudgingSessions ?? []),
          newCriteriaJudgingSession,
        ],
      }));
    }
  },
}));
