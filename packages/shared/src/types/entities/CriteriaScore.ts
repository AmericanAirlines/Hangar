import { CriteriaScoreDTO } from '@hangar/database';

// Intentionally omit dates; we won't need them in the UI
export type CriteriaScore = Omit<CriteriaScoreDTO, 'createdAt' | 'updatedAt'>;
