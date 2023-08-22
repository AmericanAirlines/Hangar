import { Request } from 'express';
import { User } from '@hangar/database';
import { MockEntityManager, createMockEntityManager } from '../createMockEntityManager';

type MockRequest = jest.Mocked<
  Partial<Omit<Request, 'entityManager'>> & { entityManager: MockEntityManager }
>;

export const createMockRequest: (defaults?: Partial<MockRequest>) => MockRequest = (
  defaults = {},
) => ({
  entityManager: createMockEntityManager(),
  loggerSuffix: '',
  user: undefined as unknown as User,
  body: undefined,
  ...defaults,
});
