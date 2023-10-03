import express from 'express';
import supertest from 'supertest';
import { createMockHandler } from '../../../../testUtils/expressHelpers/createMockHandler';
import { createMockNext } from '../../../../testUtils/expressHelpers/createMockNext';

jest.mock('../../../../../src/api/expoJudgingSession/id/projects/get', () => ({
  get: createMockHandler(),
}));

describe('id router', () => {
  it('registers the get handler', async () => {
    await jest.isolateModulesAsync(async () => {
      const { projects } = await import('../../../../../src/api/expoJudgingSession/id/projects');
      const app = express();
      app.use(projects);

      const res = await supertest(app).get('');
      expect(res.status).toEqual(200);
    });
  });
});
