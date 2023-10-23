import { ExpoJudgingSession, wait } from '@hangar/shared';
import { create } from 'zustand';
import { fetchExpoJudgingSessions } from './fetchExpoJudgingSessions';
import { createExpoJudgingSession } from './createExpoJudgingSession';

type ExpoJudgingSessionStore = {
  expoJudgingSessions?: ExpoJudgingSession[];
  doneLoading: boolean;
  fetchExpoJudgingSessions: () => Promise<void>;
  addExpoJudgingSession: (...args: Parameters<typeof createExpoJudgingSession>) => Promise<void>;
};

export const useExpoJudgingSessionStore = create<ExpoJudgingSessionStore>((set) => ({
  expoJudgingSessions: undefined,
  doneLoading: false,
  fetchExpoJudgingSessions: async () => {
    const [expoJudgingSessions] = await Promise.all([fetchExpoJudgingSessions(), wait(1000)]);
    set({
      expoJudgingSessions,
      doneLoading: true,
    });
  },
  addExpoJudgingSession: async (...args) => {
    const newEjs = await createExpoJudgingSession(...args);

    if (newEjs) {
      set((state) => ({
        expoJudgingSessions: [...(state.expoJudgingSessions ?? []), newEjs],
      }));
    }
  },
}));
