import express from 'express';
import supertest from 'supertest';
import { createMockHandler } from '../../testUtils/expressHelpers/createMockHandler';
import { createMockNext } from '../../testUtils/expressHelpers/createMockNext';

jest.mock('../../../src/api/judge/post', () => ({
  post: createMockHandler(),
}));

jest.mock('../../../src/middleware/judgeMiddleware', () => ({
  judgeMiddleware: createMockNext(),
}));

describe('/judge post endpoint registration', () => {
  it('uses judgeMiddleware and registers the route for the handler', async () => {
    await jest.isolateModulesAsync(async () => {
      const { judge } = await import('../../../src/api/judge');

      const app = express();
      app.use(judge);
      const res = await supertest(app).post('');
      expect(res.status).toEqual(200);
    });
  });
});
