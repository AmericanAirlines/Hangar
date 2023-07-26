/* istanbul ignore file */
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import {
  EntityCaseNamingStrategy,
  LoadStrategy,
  MigrationsOptions,
  Options,
} from '@mikro-orm/core';
import { Migrator } from '@mikro-orm/migrations';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { getEnv } from '../env';

export const migrationsPath = `${__dirname}/../migrations`;
export const entitiesPath = [`${__dirname}/../entities`];

export const baseExtensions = [Migrator];

/**
 * Base MikroORM Config
 */
export const getBaseConfig = (): Options<PostgreSqlDriver> => {
  const env = getEnv();
  return {
    driver: PostgreSqlDriver,
    clientUrl: env.databaseUrl,
    user: env.databaseUser,
    password: env.databasePassword,
    forceUndefined: true,
    autoJoinOneToOneOwner: false,
    debug: env.dbLoggingEnabled === 'true',
    namingStrategy: EntityCaseNamingStrategy, // Camel case property and table names
    entities: entitiesPath,
    loadStrategy: LoadStrategy.JOINED,
    extensions: [Migrator],
    highlighter: new SqlHighlighter(),
  };
};

export const migrations: MigrationsOptions = {
  tableName: 'migrations',
  path: migrationsPath,
  transactional: true, // wrap each migration in a transaction
  disableForeignKeys: false, // wrap statements with `set foreign_key_checks = 0` or equivalent
  allOrNothing: true, // wrap all migrations in master transaction
  safe: false, // allow to disable table and column dropping
  emit: 'ts',
  snapshot: true,
};
