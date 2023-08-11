import { PrizeDTO } from '@hangar/database';
import { Dayjs } from 'dayjs';

export type Prize = Omit<PrizeDTO, 'createdAt' | 'updatedAt'> & {
  createdAt: Dayjs;
  updatedAt: Dayjs;
};

export type SerializedPrize = Omit<Prize, 'createdAt' | 'updatedAt'> & {
  createdAt: string;
  updatedAt: string;
};
