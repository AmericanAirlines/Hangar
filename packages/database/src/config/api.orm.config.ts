import { Options } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { getBaseConfig, migrations } from './orm.config';

/**
 * Configuration for the API that accesses the database
 */
export const getApiConfig = (): Options<PostgreSqlDriver> => ({
  ...getBaseConfig(),
  pool: {
    min: 2,
    max: 10,
  },
  migrations,
});
