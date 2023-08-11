import { JudgeDTO } from '@hangar/database';
import { Dayjs } from 'dayjs';

export type Judge = Omit<JudgeDTO, 'createdAt' | 'updatedAt'> & {
  createdAt: Dayjs;
  updatedAt: Dayjs;
};

export type SerializedJudge = Omit<Judge, 'createdAt' | 'updatedAt'> & {
  createdAt: string;
  updatedAt: string;
};
