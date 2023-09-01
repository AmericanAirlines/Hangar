import { ExpoJudgingSessionDTO } from '@hangar/database';
import { Dayjs } from 'dayjs';

export type ExpoJudgingSession = Omit<ExpoJudgingSessionDTO, 'createdAt' | 'updatedAt'> & {
  createdAt: Dayjs;
  updatedAt: Dayjs;
};

export type SerializedExpoJudgingSession = Omit<ExpoJudgingSession, 'createdAt' | 'updatedAt'> & {
  createdAt: string;
  updatedAt: string;
};
