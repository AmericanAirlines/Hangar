import { ExpoJudgingSession, SerializedExpoJudgingSession } from '@hangar/shared';
import axios from 'axios';
import dayjs from 'dayjs';
import create from 'zustand';

type ExpoJudgingSessionStore = {
  expoJudgingSessions?: ExpoJudgingSession[];
  doneLoading: boolean;
  fetchExpoJudgingSessions: () => Promise<void>;
  addExpoJudgingSessions: (esj: ExpoJudgingSession) => Promise<void>;
};

export const useExpoJudgingSessionStore = create<ExpoJudgingSessionStore>((set) => ({
  expoJudgingSessions: undefined,
  doneLoading: false,
  fetchExpoJudgingSessions: async () => {
    let expoJudgingSessions: ExpoJudgingSession[] | undefined;
    try {
      const res = await axios.get<SerializedExpoJudgingSession[]>(`/api/expoJudgingSession`);
      expoJudgingSessions = res.data.map(
        (serializedEJS) =>
          ({
            id: serializedEJS.id,
            inviteCode: serializedEJS.inviteCode,
            createdBy: serializedEJS.createdBy,
            createdAt: dayjs(serializedEJS.createdAt),
            updatedAt: dayjs(serializedEJS.updatedAt),
          } as ExpoJudgingSession),
      );
    } catch (error) {
      if (!axios.isAxiosError(error) || error.status !== 401) {
        // eslint-disable-next-line no-console
        console.error(error);
        // TODO: Show error toast
      }
    }
    set({ expoJudgingSessions, doneLoading: true });
  },
  addExpoJudgingSessions: async (esj: ExpoJudgingSession) => {
    try {
      set((state) => ({
        expoJudgingSessions: state.expoJudgingSessions?.concat([esj]),
        doneLoading: true,
      }));
    } catch (error) {
      if (!axios.isAxiosError(error) || error.status !== 401) {
        // eslint-disable-next-line no-console
        console.error(error);
        // TODO: Show error toast
      }
    }
  },
}));
