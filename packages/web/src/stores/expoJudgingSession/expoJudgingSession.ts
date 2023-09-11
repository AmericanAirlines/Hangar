import { ExpoJudgingSession } from '@hangar/shared';
import create from 'zustand';
import { fetchExpoJudgingSessions } from './fetchExpoJudgingSessions';
import { createExpoJudgingSession } from './createExpoJudgingSession';

type ExpoJudgingSessionStore = {
  expoJudgingSessions?: ExpoJudgingSession[];
  doneLoading: boolean;
  fetchExpoJudgingSessions: () => Promise<void>;
  addExpoJudgingSessions: (args: Parameters<typeof createExpoJudgingSession>[0]) => Promise<void>;
};

export const useExpoJudgingSessionStore = create<ExpoJudgingSessionStore>((set) => ({
  expoJudgingSessions: undefined,
  doneLoading: false,
  fetchExpoJudgingSessions: async () => {
    set({ expoJudgingSessions: await fetchExpoJudgingSessions() });
  },
  addExpoJudgingSessions: async (args) => {
    const newEsj: ExpoJudgingSession = await createExpoJudgingSession(args);
    set((state) => ({
      expoJudgingSessions: [...(state.expoJudgingSessions ?? []), newEsj],
    }));
  },
}));
