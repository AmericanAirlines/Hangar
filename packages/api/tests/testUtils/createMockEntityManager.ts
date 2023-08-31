import { EntityManager } from '@mikro-orm/postgresql';

export type MockEntityManager = jest.Mocked<Partial<EntityManager>>;

export const createMockEntityManager: (defaults?: MockEntityManager) => MockEntityManager = (
  defaults = {},
) => {
  const em = {
    getConnection: jest.fn().mockReturnValue({ isConnected: jest.fn().mockReturnValue(true) }),
    find: jest.fn(),
    findOne: jest.fn(),
    findOneOrFail: jest.fn(),
    flush: jest.fn(),
    persist: jest.fn(),
    persistAndFlush: jest.fn(),
    ...defaults,
  };

  em.transactional =
    defaults.transactional ??
    (jest.fn(async (transaction: (em: EntityManager) => Promise<void>) =>
      transaction(em as any),
    ) as jest.Mock);

  return em;
};
