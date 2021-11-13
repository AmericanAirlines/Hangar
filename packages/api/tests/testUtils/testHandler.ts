import express, { Handler } from 'express';
import supertest, { SuperTest, Test } from 'supertest';
import { EntityManager } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';

type MockEntityManager = jest.Mocked<
  Pick<
    EntityManager<PostgreSqlDriver>,
    'fork' | 'find' | 'findOne' | 'flush' | 'count' | 'persistAndFlush'
  >
>;

type MockForkedEntityManager = Omit<MockEntityManager, 'fork'>;

type MockedHandler = jest.MockedFunction<Handler>;
type EnhancedSuperTest = SuperTest<Test> & {
  entityManager: MockEntityManager;
  forkedEntityManager: MockForkedEntityManager;
  next: MockedHandler;
};

const createTestApp = (...handlers: Handler[]) => {
  // If additional methods are needed, add them here and to the `MockEntityManager` type
  const forkedEntityManager: MockForkedEntityManager = {
    find: jest.fn(),
    findOne: jest.fn(),
    flush: jest.fn(),
    count: jest.fn(),
    persistAndFlush: jest.fn(),
  };

  const entityManager: MockEntityManager = {
    fork: jest.fn(() => forkedEntityManager) as any,
    find: jest.fn(),
    findOne: jest.fn(),
    flush: jest.fn(),
    count: jest.fn(),
    persistAndFlush: jest.fn(),
  };

  const mockNext: MockedHandler = jest.fn((_req, _res, next) => next());

  const app = express();
  app.use(express.json());

  app.use(mockNext, (req, _res, next) => {
    req.entityManager = entityManager as unknown as EntityManager<PostgreSqlDriver>;
    next();
  });

  for (const handler of handlers) {
    app.use(handler);
  }

  return { app, entityManager, forkedEntityManager, next: mockNext };
};

export const testHandler = (...handlers: Handler[]): EnhancedSuperTest => {
  const { app, entityManager, forkedEntityManager, next } = createTestApp(...handlers);
  const handlerInstance = supertest(app) as EnhancedSuperTest;

  handlerInstance.entityManager = entityManager;
  handlerInstance.forkedEntityManager = forkedEntityManager;
  handlerInstance.next = next;

  return handlerInstance;
};
