import { JudgingSessionDTO } from '@hangar/database';
import { Dayjs } from 'dayjs';

export type JudgingSession = Omit<JudgingSessionDTO, 'createdAt' | 'updatedAt'> & {
  createdAt: Dayjs;
  updatedAt: Dayjs;
};

export type SerializedJudgingSession = Omit<JudgingSession, 'createdAt' | 'updatedAt'> & {
  createdAt: string;
  updatedAt: string;
};
