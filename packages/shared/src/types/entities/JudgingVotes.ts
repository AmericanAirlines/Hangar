import { JudgingVoteDTO } from '@hangar/database';
import { Dayjs } from 'dayjs';

export type JudgingVote = Omit<JudgingVoteDTO, 'createdAt' | 'updatedAt'> & {
  createdAt: Dayjs;
  updatedAt: Dayjs;
};

export type SerializedJudgingVote = Omit<JudgingVote, 'createdAt' | 'updatedAt'> & {
  createdAt: string;
  updatedAt: string;
};
