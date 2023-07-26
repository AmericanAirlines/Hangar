/* istanbul ignore file */
import setEnv from '@americanairlines/simple-env';

export const getEnv = () =>
  setEnv({
    required: {
      databaseUrl: 'DATABASE_URL',
    },
    optional: {
      dbLoggingEnabled: 'DB_LOGGING_ENABLED',
      databaseUser: 'DATABASE_USER',
      databasePassword: 'DATABASE_PASS',
      disableDatabaseSSL: 'DISABLE_DATABASE_SSL',
    },
  });
