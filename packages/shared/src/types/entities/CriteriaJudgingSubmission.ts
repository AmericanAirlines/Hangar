import { CriteriaSubmissionDTO } from '@hangar/database';

export type CriteriaJudgingSubmission = Omit<CriteriaSubmissionDTO, 'createdAt' | 'updatedAt'>;
