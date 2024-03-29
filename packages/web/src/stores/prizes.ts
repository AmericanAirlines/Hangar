import { Prize, SerializedPrize } from '@hangar/shared';
import axios from 'axios';
import dayjs from 'dayjs';
import { create } from 'zustand';
import { openErrorToast } from '../components/utils/CustomToast';

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
      if (!axios.isAxiosError(error)) {
        // eslint-disable-next-line no-console
        console.error(error);

        openErrorToast({
          title: 'Failed to fetch prizes',
          description: (error as Error).message,
        });
      }
    }
    set({ prizes, doneLoading: true });
  },
}));
