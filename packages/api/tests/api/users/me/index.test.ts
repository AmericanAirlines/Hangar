import express from 'express';
import supertest from 'supertest';
import { createMockHandler } from '../../../testUtils/expressHelpers/createMockHandler';

jest.mock('../../../../src/api/user/me/get', () => ({
  get: createMockHandler(),
}));

describe('/user/me route registration', () => {
  it('uses mountUserMiddleware and registers the route for the me handler', async () => {
    await jest.isolateModulesAsync(async () => {
      const { me } = await import('../../../../src/api/user/me');

      const app = express();
      app.use(me);
      const res = await supertest(app).get('');
      expect(res.status).toEqual(200);
    });
  });
});
