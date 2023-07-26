/* istanbul ignore file */
import { Options } from '@mikro-orm/core';
import { config } from 'dotenv-flow';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { SeedManager } from '@mikro-orm/seeder';
import readlineSync from 'readline-sync';
import fs from 'fs';
import {
  baseExtensions,
  entitiesPath,
  getBaseConfig,
  migrations,
  migrationsPath,
} from './orm.config';

config({ path: `${__dirname}/../../../api/` });

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
    counter = parseInt(lastFileName.split(DELIMITER)[0] ?? '', 10) + 1;
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

const baseConfig = getBaseConfig();

const cliConfig: Options<PostgreSqlDriver> = {
  ...baseConfig,
  tsNode: true,
  entitiesTs: entitiesPath,
  migrations: {
    ...migrations,
    fileName: descriptionFileName,
  },
  extensions: [...baseExtensions, SeedManager],
  seeder: {
    path: `${__dirname}/../../seeds/`,
    pathTs: `${__dirname}/../../seeds/`,
    defaultSeeder: 'DatabaseSeeder',
    glob: '!(*.d).{js,ts}',
    emit: 'ts',
    fileName: (className: string) => className,
  },
};

export default cliConfig;
