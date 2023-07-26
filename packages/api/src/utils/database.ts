import { getApiConfig, initDatabase } from '@hangar/database';
import { env } from '../env';

let orm: Awaited<ReturnType<typeof initDatabase>> | undefined;

export const initDb = async () => {
  orm = await initDatabase({
    migrate: env.nodeEnv === 'production',
    config: getApiConfig(),
  });

  return orm;
};

export const getDbConnection = () => {
  if (!orm) throw new Error('DB connection not initialized');

  return orm;
};
