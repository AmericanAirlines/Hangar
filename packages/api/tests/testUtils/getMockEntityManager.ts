import { EntityManager } from '@mikro-orm/postgresql';

export type MockEntityManager = jest.Mocked<Partial<EntityManager>>;

export const getMockEntityManager: (defaults?: MockEntityManager) => MockEntityManager = (
  defaults = {},
) => ({
  getConnection: jest.fn().mockReturnValue({ isConnected: jest.fn().mockReturnValue(true) }),
  ...defaults,
});
