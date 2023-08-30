import express from 'express';
import supertest from 'supertest';
import { createMockHandler } from '../../testUtils/expressHelpers/createMockHandler';
import { createMockNext } from '../../testUtils/expressHelpers/createMockNext';

jest.mock('../../../src/api/project/post', () => ({
  post: createMockHandler(),
}));

jest.mock('../../../src/middleware/mountUserMiddleware', () => ({
  mountUserMiddleware: createMockNext(),
}));

describe('/project post endpoint registration', () => {
  it('uses mountUserMiddleware and registers the route for the me handler', async () => {
    await jest.isolateModulesAsync(async () => {
      const { project } = await import('../../../src/api/project');

      const app = express();
      app.use(project);
      const res = await supertest(app).post('');
      expect(res.status).toEqual(200);
    });
  });
});
