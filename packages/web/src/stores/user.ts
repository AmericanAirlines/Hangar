import { SerializedUser, User } from '@hangar/shared';
import axios from 'axios';
import dayjs from 'dayjs';
import create from 'zustand';
import { openErrorToast } from '../components/utils/CustomToast';

type UserStore = {
  user?: User;
  doneLoading: boolean;
  fetchUser: () => Promise<void>;
};

export const useUserStore = create<UserStore>((set) => ({
  user: undefined,
  doneLoading: false,
  fetchUser: async () => {
    let user: User | undefined;
    try {
      const res = await axios.get<SerializedUser>(`/api/user/me`);
      const { createdAt, updatedAt, ...rest } = res.data;
      user = { ...rest, createdAt: dayjs(createdAt), updatedAt: dayjs(updatedAt) };
    } catch (error) {
      if (!axios.isAxiosError(error) || error.status !== 401) {
        // eslint-disable-next-line no-console
        console.error(error);

        openErrorToast({
          title: 'Failed to fetch user details',
          description: (error as Error).message,
        });
      }
    }
    set({ user, doneLoading: true });
  },
}));
