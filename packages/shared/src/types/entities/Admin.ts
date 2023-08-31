import { AdminDTO } from '@hangar/database';
import { Dayjs } from 'dayjs';

export type Admin = Omit<AdminDTO, 'createdAt' | 'updatedAt'> & {
  createdAt: Dayjs;
  updatedAt: Dayjs;
};

export type SerializedAdmin = Omit<AdminDTO, 'createdAt' | 'updatedAt'> & {
  createdAt: string;
  updatedAt: string;
};
