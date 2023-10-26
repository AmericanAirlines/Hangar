import { CriteriaJudgingSubmissionDTO } from '@hangar/database';

export type CriteriaJudgingSubmission = Omit<
  CriteriaJudgingSubmissionDTO,
  'createdAt' | 'updatedAt'
>;
