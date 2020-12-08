import 'jest';
import { Config } from '../entities/config';
import { createDbConnection, closeDbConnection } from './testdb';

jest.mock('../discord');
/* eslint-disable no-await-in-loop */

describe('judging', () => {
  beforeEach(async () => {
    await createDbConnection();
  });

  afterEach(async () => {
    await closeDbConnection();
  });

  // Test in-memory db by using config as an example
  it('the in-memory test db works', async () => {
    const item = new Config('something', 'something else');
    await item.save();
    const foundItem = await Config.findOneOrFail({ key: item.key });
    expect(foundItem).toEqual(item);
  });
});
