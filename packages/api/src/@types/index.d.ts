import type { EntityManager } from '@mikro-orm/core';
import type { PostgreSqlDriver } from '@mikro-orm/postgresql';

declare global {
  namespace Express {
    export interface Request {
      entityManager: EntityManager<PostgreSqlDriver>;
    }
    export interface User {
      accessToken: string;
      refreshToken: string;
      profile: { id: string };
    }
  }
}
