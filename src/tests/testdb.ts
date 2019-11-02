import { createConnection, getConnection } from 'typeorm';
import path from 'path';
import { SqliteConnectionOptions } from 'typeorm/driver/sqlite/SqliteConnectionOptions';

export async function createDbConnection(): Promise<void> {
  await createConnection({
    type: 'sqlite',
    database: ':memory:',
    entities: [path.join(__dirname, '../entities/*')],
    synchronize: true,
    dropSchema: true,
    flags: 'SQLITE_ENABLE_UPDATE_DELETE_LIMIT',
  } as SqliteConnectionOptions);
}

export async function closedbConnection(): Promise<void> {
  await getConnection().close();
}
