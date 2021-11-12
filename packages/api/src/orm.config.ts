/* istanbul ignore file */
import { MongoNamingStrategy, Options } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import readlineSync from 'readline-sync';
import fs from 'fs';
import { env } from './env';

const migrationsPath = `${__dirname}/migrations`;
const migrationFileRegex = /^\d+[\w-]+.(ts|js)$/;

/**
 * Asks the user for a short description and increments a counter.
 * Generates file names that follow the following naming structure.
 *
 * `0012-short-description-from-user-input`
 */
const descriptionFileName = (): string => {
  const DELIMITER = '-';

  // Get the last migration
  const lastFileName = fs
    .readdirSync(migrationsPath)
    .filter((file) => migrationFileRegex.test(file))
    .pop();

  let counter = 0;

  if (lastFileName) {
    // Increment the counter based on the last migration
    counter = parseInt(lastFileName.split(DELIMITER)[0], 10) + 1;
  }

  // Ask user for a short description (keep asking until you get something or they quit with ctrl+c)
  let name = '';
  while (!name) {
    name = readlineSync
      .question(
        "\nWhat does this migration do? (Keep it short, it's going in the file name)\nExample: add the user table\n\n> ",
      )
      .replace(/[^\w\s]/gi, ' ') // Replace any non-alphanumeric or whitespace characters with spaces
      .replace(/\s+/gi, DELIMITER) // Replace any number of whitespace characters with the delimiter
      .toLowerCase();
  }

  // New line to find question in logs easier
  // eslint-disable-next-line no-console
  console.log();

  return `${counter.toString().padStart(4, '0')}-${name}`;
};

export default {
  type: 'postgresql' as const,
  clientUrl: env.databaseUrl,
  user: env.databaseUser,
  entities: [`${__dirname}/entities/*.js`],
  entitiesTs: [`${__dirname}/entities/*.ts`],
  forceUndefined: true,
  debug: env.nodeEnv !== 'production',
  namingStrategy: MongoNamingStrategy, // Camel case property and table names
  driverOptions: {
    connection: {
      ssl:
        env.nodeEnv === 'production'
          ? {
              rejectUnauthorized: false,
              sslmode: 'require',
            }
          : undefined,
    },
  },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    tableName: 'migrations',
    path: migrationsPath,
    pattern: migrationFileRegex,
    transactional: true, // wrap each migration in a transaction
    disableForeignKeys: false, // wrap statements with `set foreign_key_checks = 0` or equivalent
    allOrNothing: true, // wrap all migrations in master transaction
    safe: false, // allow to disable table and column dropping
    emit: 'ts',
    fileName: descriptionFileName,
  },
} as Options<PostgreSqlDriver>;
