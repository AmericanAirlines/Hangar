import type { EntityManager, PostgreSqlDriver } from '@mikro-orm/postgresql';
import { User } from '@hangar/database';

type Session = {
  id: string;
};

declare global {
  namespace Express {
    export interface Request {
      session: Session;
      entityManager: EntityManager<PostgreSqlDriver>;
      /**
       * These will only be populated if the corresponding middleware populates these values first
       */
      user: User;
      loggerSuffix: string;
    }
  }
}
