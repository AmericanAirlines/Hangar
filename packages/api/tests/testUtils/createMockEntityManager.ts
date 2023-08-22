import { EntityManager } from '@mikro-orm/postgresql';

export type MockEntityManager = jest.Mocked<Partial<EntityManager>>;

export const createMockEntityManager: (defaults?: MockEntityManager) => MockEntityManager = (
  defaults = {},
) => ({
  getConnection: jest.fn().mockReturnValue({ isConnected: jest.fn().mockReturnValue(true) }),
  find: jest.fn(),
  findOne: jest.fn(),
  flush: jest.fn(),
  persist: jest.fn(),
  persistAndFlush: jest.fn(),
  ...defaults,
});
