import type { EntityManager, PostgreSqlDriver } from '@mikro-orm/postgresql';
import { User, Admin, Judge } from '@hangar/database';

type Session = {
  id?: string;
};

declare global {
  namespace Express {
    export interface Request {
      session: Session | null;
      entityManager: EntityManager<PostgreSqlDriver>;
      /**
       * These will only be populated if the corresponding middleware populates these values first
       */
      user: User;
      admin: Admin;
      judge: Judge;
      loggerSuffix: string;
    }
  }
}
