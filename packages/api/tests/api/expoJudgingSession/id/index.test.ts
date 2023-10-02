import express from 'express';
import supertest from 'supertest';
import { createMockHandler } from '../../../testUtils/expressHelpers/createMockHandler';

jest.mock('../../../../src/api/expoJudgingSession/id/get', () => ({
  get: createMockHandler(),
}));

describe('id router', () => {
  it('registers the get handler', async () => {
    await jest.isolateModulesAsync(async () => {
      const { id } = await import('../../../../src/api/expoJudgingSession/id');

      const app = express();
      app.use(id);
      const res = await supertest(app).get('');
      expect(res.status).toEqual(200);
    });
  });
});
