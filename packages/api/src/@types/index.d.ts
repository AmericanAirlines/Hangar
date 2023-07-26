import type { EntityManager, PostgreSqlDriver } from '@mikro-orm/postgresql';
import { User } from '@hangar/database';

declare global {
  namespace Express {
    export interface Request {
      entityManager: EntityManager<PostgreSqlDriver>;
      /**
       * These will only be populated if the corresponding middleware populates these values first
       */
      user: User;
      loggerSuffix: string;
    }
  }
}
