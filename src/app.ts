import express from 'express';
import next from 'next';
import { createConnection, getConnectionOptions, getConnection, ConnectionOptions } from 'typeorm';
import path from 'path';
import { WebClient } from '@slack/web-api';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { slackApp, initListeners } from './slack';
import logger from './logger';
import { requireAuth } from './api/middleware/requireAuth';
import { getActivePlatform, SupportedPlatform } from './common';
import { env } from './env';

export const app = express();

let appLoading = true;

// DO NOT PUT THIS LINE IN THIS FILE `express.json()`

app.get(
  '/',
  (_req, _res, nextFn) => {
    if (appLoading) {
      nextFn();
    } else {
      nextFn('route');
    }
  },
  (_req, res) => {
    res.send('👋 Loading');
  },
);

async function initDatabase(): Promise<void> {
  // This is needed for tests that are testing the initialization of the app.
  // The tests already connect to an in-memory SQLite database, so connecting to Postgres would cause those tests to fail.
  try {
    getConnection();
    return;
  } catch (err) {} // eslint-disable-line no-empty

  if (env.nodeEnv !== 'test') {
    // Pull connection options from ormconfig.json
    let options: ConnectionOptions = await getConnectionOptions();
    const url = env.databaseUrl || (options as PostgresConnectionOptions).url;

    // NOTE: This should only apply to apps hosted in Heroku with the Heroku Postgres add-on
    if (env.dbSSLDisabled === 'true') {
      logger.warning(
        'SSL validation for database connection is disabled. If SSL validation is available, modify the DB_SSL_DISABLED environment variable.',
      );
      options = {
        ...options,
        ssl: {
          rejectUnauthorized: false,
        },
      } as ConnectionOptions;
    }

    try {
      await createConnection({
        ...options,
        url,
        entities: [path.join(__dirname, 'entities/*')],
        migrations: [path.join(__dirname, 'migrations/*')],
        migrationsRun: true,
      } as PostgresConnectionOptions);
    } catch (err) {
      logger.error('Database Connection Error: ', err);
      throw new Error('Failed to connect to Database. See logs above for details.');
    }
  }
}

export async function initSlack(): Promise<void> {
  try {
    if (env.slackBotToken) {
      await new WebClient(env.slackBotToken).auth.test();
      initListeners();
      app.use(slackApp);
      logger.info('Slack app initialized successfully');
      return;
    }
    logger.info('Slack skipped (missing SLACK_BOT_TOKEN)');
    if (env.nodeEnv !== 'test') {
      process.exit(1);
    }
  } catch (err) {
    if (env.nodeEnv !== 'test') {
      logger.error('Slack Bot Token is invalid: ', err);
      process.exit(1);
    }
  }
}

export async function initDiscord(): Promise<void> {
  try {
    if (env.discordBotToken) {
      const { setupDiscord } = await import('./discord');

      await setupDiscord(env.discordBotToken);
      logger.info('Discord connected and authenticated successfully');

      return;
    }

    logger.info('Discord skipped (missing DISCORD_BOT_TOKEN)');
  } catch (err) {
    if (env.nodeEnv !== 'test') {
      logger.error('Discord token is invalid. ', err);
      process.exit(1);
    }
  }
}

export async function initNext(): Promise<void> {
  const nextApp = next({ dev: env.nodeEnv !== 'production' });
  const nextHandler = nextApp.getRequestHandler();
  await nextApp.prepare();
  app.get(['/'], requireAuth(true), (req, res) => nextHandler(req, res));
  app.get('*', (req, res) => nextHandler(req, res));
}

export const init = async (): Promise<void> => {
  // await Promise.all([initDatabase(), initSlack(), initDiscord()])

  const promises = [];
  promises.push(initDatabase());

  if (getActivePlatform() === SupportedPlatform.slack) {
    promises.push(initSlack());
  } else {
    promises.push(initDiscord());
  }
  await Promise.all(promises);

  if (env.nodeEnv === 'production') {
    await initNext();
  } else if (env.nodeEnv !== 'test') {
    initNext()
      .then(() => logger.info('Next app initialized successfully'))
      .catch((err) => {
        logger.crit('Unable to start Next app: ', err);
        process.exit(1);
      });
  }

  appLoading = false;
};
