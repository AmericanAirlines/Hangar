import { ExpoJudgingVoteDTO } from '@hangar/database';
import { Dayjs } from 'dayjs';

export type ExpoJudgingVote = Omit<ExpoJudgingVoteDTO, 'createdAt' | 'updatedAt'> & {
  createdAt: Dayjs;
  updatedAt: Dayjs;
};

export type SerializedExpoJudgingVote = Omit<ExpoJudgingVote, 'createdAt' | 'updatedAt'> & {
  createdAt: string;
  updatedAt: string;
};
