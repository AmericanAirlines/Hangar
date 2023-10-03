import express from 'express';
import supertest from 'supertest';
import { createMockHandler } from '../../../../testUtils/expressHelpers/createMockHandler';

jest.mock('../../../../../src/api/expoJudgingSession/id/skip/post', () => ({
  post: createMockHandler(),
}));

describe('skip router', () => {
  it('registers the post handler', async () => {
    await jest.isolateModulesAsync(async () => {
      const { skip } = await import('../../../../../src/api/expoJudgingSession/id/skip');

      const app = express();
      app.use(skip);
      const res = await supertest(app).post('');
      expect(res.status).toEqual(200);
    });
  });
});
