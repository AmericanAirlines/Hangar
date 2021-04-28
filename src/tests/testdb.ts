import { createConnection, getConnection } from 'typeorm';
import path from 'path';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export async function createDbConnection(): Promise<void> {
  // For testing with Postgres database
  await createConnection({
    type: 'postgres',
    url: 'postgres://postgres:admin@localhost:5432/hangar',
    entities: [path.join(__dirname, '../entities/*')],
    synchronize: true,
    dropSchema: true,
  } as PostgresConnectionOptions);
}

export async function closeDbConnection(): Promise<void> {
  await getConnection().close();
}
