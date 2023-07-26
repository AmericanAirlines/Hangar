/* istanbul ignore file */
import express from 'express';
import { web } from '@hangar/web';
import { env } from './env';
import { api } from './api';
import { logger } from './utils/logger';
import { initDb } from './utils/database';

const app = express();
app.disable('x-powered-by');

const port = Number(env.port ?? '') || 3000;
const dev = env.nodeEnv === 'development';

void (async () => {
  logger.info('App starting...');

  const orm = await initDb();

  const includeEntityManager: express.Handler = (req, _res, next) => {
    req.entityManager = orm.em.fork();
    next();
  };
  app.use(includeEntityManager);

  // ~~~~~~~~~~ API ~~~~~~~~~~
  app.use(
    '/api', // All routes that start with `/api` but not followed by `/auth`
    api,
  );

  const webHandler = await web({ dev });

  // Assets are not protected (and should be cashed anyways)
  // TODO: Add other assets from /public; this currently only works for _next/static assets
  app.all('/_next*', webHandler);

  app.all('*', webHandler);
})()
  .then(() => {
    app.listen(port, () => {
      logger.info(`🚀 Listening at http://localhost:${port}`);
    });
  })
  .catch((error) => {
    logger.error('App failed to start: ', error);
  });
