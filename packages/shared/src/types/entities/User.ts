import { UserDTO } from '@hangar/database';
import { Dayjs } from 'dayjs';

export type User = Omit<UserDTO, 'createdAt' | 'updatedAt'> & {
  createdAt: Dayjs;
  updatedAt: Dayjs;
};

export type SerializedUser = Omit<User, 'createdAt' | 'updatedAt'> & {
  createdAt: string;
  updatedAt: string;
};
