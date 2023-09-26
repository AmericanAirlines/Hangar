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
  it('registers the route for the put handler', async () => {
    await jest.isolateModulesAsync(async () => {
      const { contributors } = await import('../../../../src/api/project/contributors/');

      const app = express();
      app.use(contributors);
      const res = await supertest(app).put('');
      expect(res.status).toEqual(200);
    });
  });
});
