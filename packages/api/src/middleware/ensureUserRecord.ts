import { EntityManager } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { Handler } from 'express';
import { User } from '../entities/User';

export interface EnsureUserRecordOptions {
  entityManager: EntityManager<PostgreSqlDriver>;
  redirectUrl: string;
}

export const ensureUserRecord =
  (options: EnsureUserRecordOptions): Handler =>
  async (req, res, next) => {
    const { user } = req;
    if (user && !user.onboardingComplete && req.originalUrl !== options.redirectUrl) {
      const userEntity = await options.entityManager.count(User, { authId: user.profile.id });

      user.onboardingComplete = !!userEntity; // They have been onboarded if they have a userEntity object

      if (!userEntity) {
        res.redirect(options.redirectUrl);
        return;
      }
    }

    next();
  };
