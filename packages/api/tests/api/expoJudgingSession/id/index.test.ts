import express from 'express';
import supertest from 'supertest';
import { createMockHandler } from '../../../testUtils/expressHelpers/createMockHandler';
import { createMockNext } from '../../../testUtils/expressHelpers/createMockNext';
import { judgeMiddleware } from '../../../../src/middleware/judgeMiddleware';
import { getMock } from '../../../testUtils/getMock';

jest.mock('../../../../src/api/expoJudgingSession/id/get', () => ({
  get: createMockHandler(),
}));

jest.mock('../../../../src/api/expoJudgingSession/id/projects', () => ({
  projects: createMockHandler(),
}));

jest.mock('../../../../src/middleware/judgeMiddleware', () => ({
  judgeMiddleware: createMockNext(),
}));

const mockJudgeMiddleware = getMock(judgeMiddleware);

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

  it('uses judgeMiddleware for judge routes', async () => {
    await jest.isolateModulesAsync(async () => {
      const { id } = await import('../../../../src/api/expoJudgingSession/id');

      const app = express();
      app.use(id);
      const res = await supertest(app).get('/projects');
      expect(res.status).toEqual(200);

      await supertest(app).get('/skip');
      await supertest(app).get('/continueSession');
      expect(mockJudgeMiddleware).toBeCalledTimes(3);
    });
  });
});
