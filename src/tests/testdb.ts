import { createConnection, getConnection } from 'typeorm';
import path from 'path';
import { SqliteConnectionOptions } from 'typeorm/driver/sqlite/SqliteConnectionOptions';
// import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export async function createDbConnection(): Promise<void> {
  await createConnection({
    type: 'sqlite',
    database: ':memory:',
    entities: [path.join(__dirname, '../entities/*')],
    synchronize: true,
    dropSchema: true,
  } as SqliteConnectionOptions);

  // For testing with Postgres database
  // await createConnection({
  //   type: 'postgres',
  //   url: 'postgres://localhost:5432/hangartest',
  //   entities: [path.join(__dirname, '../entities/*')],
  //   synchronize: true,
  //   dropSchema: true,
  // } as PostgresConnectionOptions);
}

export async function closedbConnection(): Promise<void> {
  await getConnection().close();
}
