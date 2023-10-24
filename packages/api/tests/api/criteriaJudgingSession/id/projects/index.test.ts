import express from 'express';
import supertest from 'supertest';
import { createMockHandler } from '../../../../testUtils/expressHelpers/createMockHandler';

jest.mock('../../../../../src/api/criteriaJudgingSession/id/projects/get', () => ({
  get: createMockHandler(),
}));

describe('projects router', () => {
  it('handles routes', async () => {
    await jest.isolateModulesAsync(async () => {
      const { projects } = await import(
        '../../../../../src/api/criteriaJudgingSession/id/projects'
      );

      const app = express();
      app.use(projects);
      const res = await supertest(app).get('');
      expect(res.status).toEqual(200);
    });
  });
});
