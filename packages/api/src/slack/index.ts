/* istanbul ignore file */
import { EntityManager } from '@mikro-orm/postgresql';
import { Application } from 'express';
import { App, Context, ExpressReceiver, LogLevel } from '@slack/bolt';
import { env } from '../env';
import { authorize } from './authorize';
import { getDbConnection } from '../utils/database';

export interface ContextWithEntityManager extends Context {
  entityManager: EntityManager;
}

type SlackInitResponse = {
  app: Application;
  bolt: App;
};

export const initSlack = (): SlackInitResponse => {
  const receiver = new ExpressReceiver({ signingSecret: env.slackSigningSecret });

  // Create a new bolt app using the receiver instance and authorize method above
  const bolt = new App({
    receiver,
    logLevel: (env.slackLogLevel as LogLevel) ?? LogLevel.ERROR,
    authorize: authorize(env.slackBotToken),
  });

  bolt.use(async ({ next, context }) => {
    const orm = getDbConnection();
    (context as ContextWithEntityManager).entityManager = orm.em.fork();
    await next();
  });

  return { app: receiver.app, bolt };
};
