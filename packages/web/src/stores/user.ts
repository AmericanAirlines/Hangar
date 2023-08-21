import { SerializedUser, User } from '@hangar/shared';
import axios from 'axios';
import dayjs from 'dayjs';
import create from 'zustand';

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
      const res = await axios.get<SerializedUser>(`/api/users/me`);
      const { createdAt, updatedAt, ...rest } = res.data;
      user = { ...rest, createdAt: dayjs(createdAt), updatedAt: dayjs(updatedAt) };
    } catch (error) {
      if (!axios.isAxiosError(error) || error.status !== 401) {
        // eslint-disable-next-line no-console
        console.error(error);
        // TODO: Show error toast
      }
    }
    set({ user, doneLoading: true });
  },
}));
