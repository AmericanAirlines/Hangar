import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import next from 'next';
import { createConnection, getConnectionOptions, ConnectionOptions } from 'typeorm';
import path from 'path';
import { WebClient } from '@slack/web-api';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { slackApp } from './slack';
import { apiApp } from './api';
import logger from './logger';
import { requireAuth } from './api/middleware/requireAuth';

const app = express();
const nextApp = next({ dev: process.env.NODE_ENV !== 'production' });
const nextHandler = nextApp.getRequestHandler();

let appLoading = true;

app.use(express.json());
app.use(cookieParser(process.env.ADMIN_SECRET));

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

export default app;

const initDatabase = async (): Promise<void> => {
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
};

const initSlack = async (): Promise<void> => {
  try {
    await new WebClient(process.env.SLACK_BOT_TOKEN).auth.test();
    app.use(slackApp());
    logger.info('Slack setup successfully');
  } catch (err) {
    logger.error('Slack Bot Token is invalid', err);
    if (process.env.NODE_ENV !== 'test') {
      process.exit(1);
    }
  }
};

const initNext = async (): Promise<void> => {
  if (process.env.NODE_ENV !== 'test') {
    await nextApp.prepare();
    app.get(['/'], requireAuth(true), (req, res) => nextHandler(req, res));
    app.get('*', (req, res) => nextHandler(req, res));
  }
};

const init = async (): Promise<void> => {
  await Promise.all([initDatabase(), initSlack(), initNext()]);

  appLoading = false;
};

init();
