import 'reflect-metadata';
import { Server } from 'http';
import { app, init } from './app';
import logger from './logger';
import { env } from './env';
import { Config } from './entities/config';
import cookieParser from 'cookie-parser';
import { apiApp } from './api';

export const port = env.port || '3000';
async function start(): Promise<Server> {
  await init();

  const adminSecret = await Config.findOne('adminSecret');
  if (adminSecret) {
    app.use(cookieParser(adminSecret.value)); // lgtm [js/missing-token-validation]
  }

  app.use('/api', apiApp);

  return app.listen(port, () => {
    logger.info(`Listening at http://localhost:${port}/`);
  });
}

start().catch((err) => {
  logger.error('Something went wrong starting the app: ', err);
  process.exit(1);
});
