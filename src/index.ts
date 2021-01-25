import 'reflect-metadata';
import { Server } from 'http';
import { app, init } from './app';
import logger from './logger';

export const port = process.env.PORT || '3000';
async function start(): Promise<Server> {
  await init();
  return app.listen(port, () => {
    logger.info(`Listening on port ${port}`);
  });
}

start().catch((err) => {
  logger.error('Something went wrong starting the app: ', err);
  process.exit(1);
});
