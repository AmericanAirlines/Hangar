import type { EntityManager } from '@mikro-orm/core';
import type { PostgreSqlDriver } from '@mikro-orm/postgresql';
import type { User as UserEntity } from '../entities/User';

declare global {
  namespace Express {
    export interface Request {
      entityManager: EntityManager<PostgreSqlDriver>;
      userEntity: UserEntity;
    }
    export interface User {
      accessToken: string;
      refreshToken: string;
      profile: { id: string };
    }
  }
}
