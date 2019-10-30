import 'dotenv/config';
import express from 'express';
import { createConnection, getConnectionOptions } from 'typeorm';
import path from 'path';
import { WebClient } from '@slack/web-api';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { slackApp } from './slack';
import { apiApp } from './api';
import logger from './logger';

const app = express();

app.get('/', (_req, res) => {
  res.send('👋');
});

app.use('/api', apiApp);

export default app;

const init = async (): Promise<void> => {
  if (process.env.NODE_ENV !== 'test') {
    const options = await getConnectionOptions();
    await createConnection({
      ...options,
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [path.join(__dirname, 'entities/*')],
      migrations: [path.join(__dirname, '/migration/*')],
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
};

init();
