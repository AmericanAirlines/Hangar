import express from 'express';
import supertest from 'supertest';
import { createMockHandler } from '../../../../testUtils/expressHelpers/createMockHandler';

jest.mock('../../../../../src/api/expoJudgingSession/id/continueSession/post', () => ({
  post: createMockHandler(),
}));

describe('continue session router', () => {
  it('registers the post route', async () => {
    await jest.isolateModulesAsync(async () => {
      const { continueSession } = await import(
        '../../../../../src/api/expoJudgingSession/id/continueSession'
      );

      const app = express();
      app.use(continueSession);
      const res = await supertest(app).post('');
      expect(res.status).toEqual(200);
    });
  });
});
