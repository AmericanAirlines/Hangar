import { SerializedAdmin, Admin } from '@hangar/shared';
import axios from 'axios';
import dayjs from 'dayjs';
import create from 'zustand';
import { useCustomToast } from '../components/utils/CustomToast';

type AdminStore = {
  admin?: Admin;
  doneLoading: boolean;
  fetchAdmin: () => Promise<void>;
};

export const useAdminStore = create<AdminStore>((set) => ({
  admin: undefined,
  doneLoading: false,
  fetchAdmin: async () => {
    let admin: Admin | undefined;
    try {
      const res = await axios.get<SerializedAdmin>('/api/admin/me');
      const { createdAt, updatedAt, ...rest } = res.data;
      admin = { ...rest, createdAt: dayjs(createdAt), updatedAt: dayjs(updatedAt) };
    } catch (error) {
      if (!axios.isAxiosError(error) || error.status !== 401) {
        // eslint-disable-next-line no-console
        console.error(error);
        // TODO: Show error toast
        useCustomToast.getState().openErrorToast({
          title: 'Failed to fetch admin details',
          description: (error as Error).message,
        });
      }
    }
    set({ admin, doneLoading: true });
  },
}));
