import { CriteriaDTO } from '@hangar/database';

// Intentionally omit dates; we won't need them in the UI
export type Criteria = Omit<CriteriaDTO, 'createdAt' | 'updatedAt'>;
