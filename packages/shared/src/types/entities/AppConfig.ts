import { AppConfigDTO } from '@hangar/database';
import { Dayjs } from 'dayjs';

export type AppConfig = Omit<AppConfigDTO, 'createdAt' | 'updatedAt'> & {
  createdAt: Dayjs;
  updatedAt: Dayjs;
};

export type SerializedAppConfig = Omit<AppConfig, 'createdAt' | 'updatedAt'> & {
  createdAt: string;
  updatedAt: string;
};
