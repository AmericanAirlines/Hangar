import { getApiConfig, initDatabase } from '@hangar/database';
import { getMock } from '../testUtils/getMock';
import { mockEnv } from '../testUtils/mockEnv';

jest.mock('@hangar/database');
const initDatabaseMock = getMock(initDatabase);
const getApiConfigMock = getMock(getApiConfig);

describe('database utils', () => {
  describe('initDb', () => {
    it('loads the appropriate config', async () => {
      await jest.isolateModulesAsync(async () => {
        const { initDb } = await import('../../src/utils/database');
        const mockConfig = {};
        const mockDb = {};
        getApiConfigMock.mockReturnValueOnce(mockConfig);
        initDatabaseMock.mockReturnValueOnce(mockDb as any);

        const db = await initDb();

        expect(db).toBe(mockDb);
        expect(initDatabaseMock).toBeCalledWith(
          expect.objectContaining({
            migrate: false,
            config: mockConfig,
          }),
        );
      });
    });

    it('runs migrations in prod', async () => {
      await jest.isolateModulesAsync(async () => {
        const { initDb } = await import('../../src/utils/database');
        const mockConfig = {};
        getApiConfigMock.mockReturnValueOnce(mockConfig);

        mockEnv({ nodeEnv: 'production' });

        await initDb();

        expect(initDatabaseMock).toBeCalledWith(
          expect.objectContaining({
            migrate: true,
          }),
        );
      });
    });
  });

  describe('getDbConnection', () => {
    it('throws if the db has not been initialized', async () => {
      await jest.isolateModulesAsync(async () => {
        const { getDbConnection } = await import('../../src/utils/database');

        expect(getDbConnection).toThrow();
      });
    });

    it('returns a cached version of the orm if it has been initialized', async () => {
      await jest.isolateModulesAsync(async () => {
        const { getDbConnection, initDb } = await import('../../src/utils/database');

        const mockConfig = {};
        const mockDb = {};
        getApiConfigMock.mockReturnValueOnce(mockConfig);
        initDatabaseMock.mockReturnValueOnce(mockDb as any);

        await initDb();
        const db = await getDbConnection();

        expect(db).toEqual(mockDb);
      });
    });
  });
});
