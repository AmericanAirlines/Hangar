import { Request } from 'express';
import { User } from '@hangar/database';
import { MockEntityManager, getMockEntityManager } from './getMockEntityManager';

type MockRequest = jest.Mocked<
  Partial<Omit<Request, 'entityManager'> & { entityManager: MockEntityManager }>
>;

export const getMockRequest: (defaults?: MockRequest) => MockRequest = (defaults = {}) => ({
  entityManager: getMockEntityManager(),
  loggerSuffix: '',
  user: undefined as unknown as User,
  body: undefined,
  ...defaults,
});
