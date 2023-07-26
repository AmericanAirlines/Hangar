import { MikroORM, Options } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';

type InitDatabaseOptions = {
  migrate?: boolean;
  config: Options<PostgreSqlDriver>;
};

export const initDatabase = async ({
  migrate,
  config,
}: InitDatabaseOptions): Promise<MikroORM<PostgreSqlDriver>> => {
  const orm = await MikroORM.init(config);
  if (migrate) {
    const migrator = orm.getMigrator();
    await migrator.up(); // Run all migrations (make sure the database is in the correct state, will crash app on failure)
  }

  if (!(await orm.isConnected())) {
    throw new Error('Failed to connect to database');
  }

  return orm as MikroORM<PostgreSqlDriver>;
};
