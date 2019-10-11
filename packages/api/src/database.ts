/* istanbul ignore file */
import { MikroORM } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { env } from './env';
import ormConfig from './orm.config';

export const initDatabase = async (): Promise<MikroORM<PostgreSqlDriver>> => {
  const orm = await MikroORM.init(ormConfig);

  if (env.nodeEnv === 'production') {
    const migrator = orm.getMigrator();
    await migrator.up(); // Run all migrations (make sure the database is in the correct state, will crash app on failure)
  }

  return orm as MikroORM<PostgreSqlDriver>;
};
