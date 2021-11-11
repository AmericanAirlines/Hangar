import { EntityManager } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { Handler } from 'express';
import { User } from '../entities/User';

export interface RequireAuthAndOnboardingOptions {
  entityManager: EntityManager<PostgreSqlDriver>;
  onboardingUrl: string;
}

export const requireAuthAndOnboarding =
  (options: RequireAuthAndOnboardingOptions): Handler =>
  async (req, res, next) => {
    const { user } = req;

    if (!user) {
      res.redirect('/auth/discord');
      return;
    }

    const attemptingToGoToOnboarding = req.originalUrl === options.onboardingUrl;

    if (!user.onboardingComplete) {
      const userExists = await options.entityManager
        .count(User, { authId: user.profile.id })
        .then((count) => count > 0);

      user.onboardingComplete = userExists; // They have been onboarded if they have a userEntity object

      // The user hasn't been onboarded and is trying to go somewhere else
      if (!user.onboardingComplete && !attemptingToGoToOnboarding) {
        res.redirect(options.onboardingUrl);
        return;
      }
    }

    // The user is trying to go back to /onboarding a second time
    if (attemptingToGoToOnboarding && user.onboardingComplete) {
      res.redirect('/app');
      return;
    }

    next();
  };
