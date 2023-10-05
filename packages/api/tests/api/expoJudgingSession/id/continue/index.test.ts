import express from 'express';
import supertest from 'supertest';
import { createMockHandler } from '../../../../testUtils/expressHelpers/createMockHandler';

jest.mock('../../../../../src/api/expoJudgingSession/id/continue/get', () => ({
  get: createMockHandler(),
}));

describe('Continue router', () => {
  it('registers the get route', async () => {
    await jest.isolateModulesAsync(async () => {
      const { Continue } = await import('../../../../../src/api/expoJudgingSession/id/continue');

      const app = express();
      app.use(Continue);
      const res = await supertest(app).get('');
      expect(res.status).toEqual(200);
    });
  });
});
