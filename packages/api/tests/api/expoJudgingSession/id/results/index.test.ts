import express from 'express';
import supertest from 'supertest';
import { createMockHandler } from '../../../../testUtils/expressHelpers/createMockHandler';

jest.mock('../../../../../src/api/expoJudgingSession/id/results/get', () => ({
  get: createMockHandler(),
}));

describe('results session router', () => {
  it('registers the get route', async () => {
    await jest.isolateModulesAsync(async () => {
      const { results } = await import('../../../../../src/api/expoJudgingSession/id/results');

      const app = express();
      app.use(results);
      const res = await supertest(app).get('');
      expect(res.status).toEqual(200);
    });
  });
});
