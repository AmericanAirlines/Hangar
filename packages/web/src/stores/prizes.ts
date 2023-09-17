import { Prize, SerializedPrize } from '@hangar/shared';
import axios from 'axios';
import dayjs from 'dayjs';
import create from 'zustand';

type PrizesStore = {
  prizes?: Prize[];
  doneLoading: boolean;
  fetchPrizes: () => Promise<void>;
};

export const usePrizesStore = create<PrizesStore>((set) => ({
  prizes: undefined,
  doneLoading: false,
  fetchPrizes: async () => {
    let prizes: Prize[] | undefined;
    try {
      const res = await axios.get<SerializedPrize[]>('/api/prize');
      prizes = res.data.map(({ createdAt, updatedAt, ...rest }) => ({
        ...rest,
        createdAt: dayjs(createdAt),
        updatedAt: dayjs(updatedAt),
      }));
    } catch (error) {
      if (!axios.isAxiosError(error) || error.status !== 401) {
        // eslint-disable-next-line no-console
        console.error(error);
        // TODO: Show error toast
      }
    }
    set({ prizes, doneLoading: true });
  },
}));
