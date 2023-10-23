import { Request } from 'express';
import { User } from '@hangar/database';
import { createMockEntityManager } from '../createMockEntityManager';

type MockRequest = jest.Mocked<
  Partial<Omit<Request, 'entityManager'>> & {
    entityManager: ReturnType<typeof createMockEntityManager>;
  }
>;

export const createMockRequest = (defaults?: Partial<MockRequest>) => ({
  entityManager: createMockEntityManager(),
  loggerSuffix: '',
  user: undefined as unknown as User,
  body: undefined,
  query: {},
  params: {},
  ...defaults,
});
