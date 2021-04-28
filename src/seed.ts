import { createConnection, getConnectionOptions, getConnection, ConnectionOptions } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import path from 'path';
import { Team } from './entities/team';
import { Judge } from './entities/judge';
import { env } from './env';
import logger from './logger';

async function initDatabase(): Promise<void> {
  // This is needed for tests that are testing the initialization of the app.
  // The tests already connect to an in-memory SQLite database, so connecting to Postgres would cause those tests to fail.
  try {
    getConnection();
    return;
  } catch (err) {} // eslint-disable-line no-empty

  // Pull connection options from ormconfig.json
  const options: ConnectionOptions = await getConnectionOptions();
  const url = env.databaseUrl || (options as PostgresConnectionOptions).url;

  try {
    await createConnection({
      ...options,
      url,
      entities: [path.join(__dirname, 'entities/*')],
      migrations: [path.join(__dirname, 'migrations/*')],
      migrationsRun: true,
    } as PostgresConnectionOptions);
  } catch (err) {
    logger.error('Database Connection Error: ', err);
    throw new Error('Failed to connect to Database. See logs above for details.');
  }
}

async function createTeamData(numTeams: number): Promise<Team[]> {
  const teams: Team[] = [];
  for (let i = 0; i < numTeams; i += 1) {
    const team = await new Team(`Team ${i + 1}`, i + 1, `${Math.floor(Math.random() * 1000)}`, [String(i)]).save();
    teams.push(team);
  }
  return teams;
}

async function createJudgeData(numJudges: number): Promise<Judge[]> {
  const judges: Judge[] = [];
  for (let i = 0; i < numJudges; i += 1) {
    const judge = await new Judge().save();
    judges.push(judge);
  }
  return judges;
}

async function clearTeams(): Promise<void> {
  await Team.clear();
}

async function clearJudges(): Promise<void> {
  await Judge.clear();
}

(async (): Promise<void> => {
  const myArgs = process.argv.slice(2);
  const numTeams = myArgs[0] || 10;
  const numJudges = myArgs[1] || 5;

  console.log('Initializing database'); // eslint-disable-line no-console
  await initDatabase();
  await clearTeams();
  await clearJudges();

  console.log(`Creating ${numTeams} teams`); // eslint-disable-line no-console
  await createTeamData(+numTeams);

  console.log(`Creating ${numJudges} judges`); // eslint-disable-line no-console
  await createJudgeData(+numJudges);

  console.log('Done!'); // eslint-disable-line no-console

  process.exit(0);
})();
