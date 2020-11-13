import express from 'express';
import cookieParser from 'cookie-parser';
import next from 'next';
import { createConnection, getConnectionOptions, getConnection, ConnectionOptions } from 'typeorm';
import path from 'path';
import { WebClient } from '@slack/web-api';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { slackApp, initListeners } from './slack';
import { apiApp } from './api';
import logger from './logger';
import { requireAuth } from './api/middleware/requireAuth';

export const app = express();

let appLoading = true;

// DO NOT PUT THIS LINE IN THIS FILE `express.json()`
app.use(cookieParser(process.env.ADMIN_SECRET)); // lgtm [js/missing-token-validation]

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

app.use('/api', apiApp);

async function initDatabase(): Promise<void> {
  // This is needed for tests that are testing the initialization of the app.
  // The tests already connect to an in-memory SQLite database, so connecting to Postgres would cause those tests to fail.
  try {
    getConnection();
    return;
  } catch (err) {} // eslint-disable-line no-empty

  if (process.env.NODE_ENV !== 'test') {
    // Pull connection options from ormconfig.json
    const options: ConnectionOptions = await getConnectionOptions();
    const url = process.env.DATABASE_URL || (options as PostgresConnectionOptions).url;
    await createConnection({
      ...options,
      url,
      entities: [path.join(__dirname, 'entities/*')],
      migrations: [path.join(__dirname, 'migration/*')],
      migrationsRun: true,
    } as PostgresConnectionOptions);
  }
}

export async function initSlack(): Promise<void> {
  try {
    await new WebClient(process.env.SLACK_BOT_TOKEN).auth.test();
    initListeners();
    app.use(slackApp);
    logger.info('Slack app initialized successfully');
  } catch (err) {
    if (process.env.NODE_ENV !== 'test') {
      logger.error('Slack Bot Token is invalid: ', err);
      process.exit(1);
    }
  }
}

export async function initDiscord(): Promise<void> {
  try {
    if (process.env.DISCORD_BOT_TOKEN) {
      const { setupDiscord } = await import('./discord');

      await setupDiscord(process.env.DISCORD_BOT_TOKEN);
      logger.info('Discord connected and authenticated successfully');

      return;
    }

    logger.info('Discord skipped (missing DISCORD_BOT_TOKEN)');
  } catch (err) {
    if (process.env.NODE_ENV !== 'test') {
      logger.error('Discord token is invalid. ', err);
      process.exit(1);
    }
  }
}

export async function initNext(): Promise<void> {
  const nextApp = next({ dev: process.env.NODE_ENV !== 'production' });
  const nextHandler = nextApp.getRequestHandler();
  await nextApp.prepare();
  app.get(['/'], requireAuth(true), (req, res) => nextHandler(req, res));
  app.get('*', (req, res) => nextHandler(req, res));
}

export const init = async (): Promise<void> => {
  await Promise.all([initDatabase(), initSlack(), initDiscord()]);

  if (process.env.NODE_ENV === 'production') {
    await initNext();
  } else if (process.env.NODE_ENV !== 'test') {
    initNext()
      .then(() => logger.info('Next app initialized successfully'))
      .catch((err) => {
        logger.crit('Unable to start Next app: ', err);
        process.exit(1);
      });
  }

  appLoading = false;
};
