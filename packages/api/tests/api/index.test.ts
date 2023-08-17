import express from 'express';
import supertest from 'supertest';
import { createMockNext } from '../testUtils/createMockNext';

jest.mock('../../src/api/settings', () => ({
  enforceRateLimiting: createMockNext(),
}));

describe('/api route registration', () => {
  it('registers a generic catch-all handler', async () => {
    await jest.isolateModulesAsync(async () => {
      const { api } = require('../../src/api');
      const app = express();
      app.use(api);

      const res = await supertest(app).get('/garbageRoute');
      expect(res.statusCode).toEqual(404);
      expect(res.body).toEqual(
        expect.objectContaining({
          error: 'API route not found',
        }),
      );
    });
  });
});
