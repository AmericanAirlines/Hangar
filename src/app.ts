import 'dotenv/config';
import express from 'express';
import next from 'next';
import { createConnection, getConnectionOptions, ConnectionOptions } from 'typeorm';
import path from 'path';
import { WebClient } from '@slack/web-api';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { slackApp } from './slack';
import { apiApp } from './api';
import logger from './logger';

const app = express();
const nextApp = next({ dev: process.env.NODE_ENV !== 'production' });
const nextHandler = nextApp.getRequestHandler();

app.use(express.json());

app.get('/', (_req, res) => {
  res.send('👋');
});

app.use('/api', apiApp);

export default app;

const init = async (): Promise<void> => {
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

  try {
    await new WebClient(process.env.SLACK_BOT_TOKEN).auth.test();
    app.use(slackApp(process.env.SLACK_BOT_TOKEN));
    logger.info('Slack setup successfully');
  } catch (err) {
    logger.error('Slack Bot Token is invalid', err);
    if (process.env.NODE_ENV !== 'test') {
      process.exit(1);
    }
  }

  if (process.env.NODE_ENV !== 'test') {
    await nextApp.prepare();
    app.get('*', (req, res) => nextHandler(req, res));
  }
};

init();
