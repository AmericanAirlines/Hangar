import type { EntityManager } from '@mikro-orm/core';
import type { PostgreSqlDriver } from '@mikro-orm/postgresql';
import type { User as UserEntity } from '../entities/User';

declare global {
  namespace Express {
    export interface Request {
      entityManager: EntityManager<PostgreSqlDriver>;
      /**
       * This will ONLY be defined if you have the `populateUser`
       * middleware used before this handler. If you are unsure
       * if it will exist, use `safeUserEntity` instead.
       */
      userEntity: UserEntity;
      /**
       * This will be setup with the `populateUser` middleware.
       * Use this property if you are unsure if it's been called or not.
       */
       safeUserEntity?: UserEntity;
    }
    export interface User {
      accessToken: string;
      refreshToken: string;
      profile: { id: string };
    }
  }
}
