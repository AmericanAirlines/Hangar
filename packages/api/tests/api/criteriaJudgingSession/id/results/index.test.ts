import express from 'express';
import supertest from 'supertest';
import { createMockHandler } from '../../../../testUtils/expressHelpers/createMockHandler';

jest.mock('../../../../../src/api/criteriaJudgingSession/id/results/get', () => ({
  get: createMockHandler(),
}));

describe('results router', () => {
  it('registers a get route', async () => {
    await jest.isolateModulesAsync(async () => {
      const { results } = await import('../../../../../src/api/criteriaJudgingSession/id/results');

      const app = express();
      app.use(results);
      const res = await supertest(app).get('');
      expect(res.status).toEqual(200);
    });
  });
});
