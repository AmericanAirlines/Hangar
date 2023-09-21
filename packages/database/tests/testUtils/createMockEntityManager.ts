import { EntityManager } from '@mikro-orm/postgresql';

type MockEntityManagerDefaults = Partial<jest.Mocked<EntityManager>>;
type MockedEntityManager = jest.Mocked<
  Pick<
    EntityManager,
    'find' | 'findOne' | 'findOneOrFail' | 'flush' | 'persist' | 'persistAndFlush' | 'transactional'
  >
>;

export const createMockEntityManager = (
  defaults?: MockEntityManagerDefaults,
): MockedEntityManager => {
  const em = {
    find: jest.fn(),
    findOne: jest.fn(),
    findOneOrFail: jest.fn(),
    flush: jest.fn(),
    persist: jest.fn(),
    persistAndFlush: jest.fn(),
    transactional: jest.fn(),
    ...defaults,
  };

  if (!(defaults ?? {}).transactional) {
    // The transaction needs a reference to an entity manager
    // so we need to implement it AFTER initialization so
    // the em can be used within the transaction itself
    em.transactional.mockImplementation((async (
      transaction: (em: EntityManager) => Promise<void>,
    ) => transaction(em as any)) as jest.Mock);
  }

  return em;
};
