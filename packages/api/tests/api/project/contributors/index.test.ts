import express from 'express';
import supertest from 'supertest';
import { createMockHandler } from '../../../testUtils/expressHelpers/createMockHandler';
import { createMockNext } from '../../../testUtils/expressHelpers/createMockNext';

jest.mock('../../../../src/api/project/contributors/put', () => ({
  put: createMockHandler(),
}));

jest.mock('../../../../src/middleware/mountUserMiddleware', () => ({
  mountUserMiddleware: createMockNext(),
}));

describe('/project put endpoint registration', () => {
  it('uses mountUserMiddleware and registers the route for the me handler', async () => {
    await jest.isolateModulesAsync(async () => {
      const { contributors } = await import('../../../../src/api/project/contributors/');

      const app = express();
      app.use(contributors);
      const res = await supertest(app).put('')//.send({});
      expect(res.status).toEqual(200);
    });
  });
});
