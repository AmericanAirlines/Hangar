import { ExpoJudgingSession, SerializedExpoJudgingSession } from '@hangar/shared';
import axios from 'axios';
import dayjs from 'dayjs';
import create from 'zustand';

type ExpoJudgingSessionStore = {
  expoJudgingSession?: ExpoJudgingSession;
  doneLoading: boolean;
  fetchExpoJudgingSession: () => Promise<void>;
};

export const useExpoJudgingSessionStore = create<ExpoJudgingSessionStore>((set) => ({
  expoJudgingSession: undefined,
  doneLoading: false,
  fetchExpoJudgingSession: async () => {
    let expoJudgingSession: ExpoJudgingSession | undefined;
    try {
      const res = await axios.get<SerializedExpoJudgingSession>(`/api/user/me`);
      const { createdAt, updatedAt, ...rest } = res.data;
      expoJudgingSession = { ...rest, createdAt: dayjs(createdAt), updatedAt: dayjs(updatedAt) };
    } catch (error) {
      if (!axios.isAxiosError(error) || error.status !== 401) {
        // eslint-disable-next-line no-console
        console.error(error);
        // TODO: Show error toast
      }
    }
    set({ expoJudgingSession, doneLoading: true });
  },
}));
