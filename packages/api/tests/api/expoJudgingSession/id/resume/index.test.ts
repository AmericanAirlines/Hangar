import express from 'express';
import supertest from 'supertest';
import { createMockHandler } from '../../../../testUtils/expressHelpers/createMockHandler';

jest.mock('../../../../../src/api/expoJudgingSession/id/resume/get', () => ({
  get: createMockHandler(),
}));

describe('resume router', () => {
  it('registers the get route', async () => {
    await jest.isolateModulesAsync(async () => {
      const { resume } = await import('../../../../../src/api/expoJudgingSession/id/resume');

      const app = express();
      app.use(resume);
      const res = await supertest(app).get('');
      expect(res.status).toEqual(200);
    });
  });
});
