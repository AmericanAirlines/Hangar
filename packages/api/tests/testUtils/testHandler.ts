import express, { Handler, RequestHandler } from 'express';
import supertest, { SuperTest, Test } from 'supertest';
import type { ParamsDictionary } from 'express-serve-static-core';
import type { ParsedQs } from 'qs';
import { EntityManager } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';

type TestRequestHandler = RequestHandler<ParamsDictionary, any, any, ParsedQs, Record<string, any>>;

type MockEntityManager = jest.Mocked<
  Pick<EntityManager<PostgreSqlDriver>, 'find' | 'findOne' | 'flush'>
>;

type SuperTestWithEntityManager = SuperTest<Test> & { entityManager: MockEntityManager };

const createTestApp = (handler: TestRequestHandler, middleware?: Handler) => {
  // If additional methods are needed, add them here and to the `MockEntityManager` type
  const entityManager: MockEntityManager = {
    find: jest.fn(),
    findOne: jest.fn(),
    flush: jest.fn(),
  };

  const app = express();
  
  const continueMiddleware: Handler = (_req, _res, next) => next();
  app.use(middleware ?? continueMiddleware);

  app.use((req, _res, next) => {
    req.entityManager = entityManager as unknown as EntityManager<PostgreSqlDriver>;
    next();
  });
  app.use(handler);

  return { app, entityManager };
};

export const testHandler = (
  handler: TestRequestHandler,
  middleware?: Handler,
): SuperTestWithEntityManager => {
  const { app, entityManager } = createTestApp(handler, middleware);
  const handlerInstance = supertest(app) as SuperTestWithEntityManager;
  handlerInstance.entityManager = entityManager;
  return handlerInstance;
};
