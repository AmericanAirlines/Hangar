import express from 'express';
import supertest from 'supertest';
import { createMockHandler } from '../../../testUtils/expressHelpers/createMockHandler';
import { createMockNext } from '../../../testUtils/expressHelpers/createMockNext';
import { judgeMiddleware } from '../../../../src/middleware/judgeMiddleware';
import { expoJudgeAccessMiddleware } from '../../../../src/middleware/expoJudgeAccessMiddleware';
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

jest.mock('../../../../src/middleware/expoJudgeAccessMiddleware', () => ({
  expoJudgeAccessMiddleware: createMockNext(),
}));

const mockJudgeMiddleware = getMock(judgeMiddleware);

describe('id router', () => {
  it('uses judgeMiddleware for judge routes', async () => {
    await jest.isolateModulesAsync(async () => {
      const { id } = await import('../../../../src/api/expoJudgingSession/id');

      const app = express();
      app.use(id);
      const res = await supertest(app).get('/projects');
      expect(res.status).toEqual(200);

      await supertest(app).get('/skip');
      await supertest(app).get('/continueSession');
      await supertest(app).get('');
      expect(mockJudgeMiddleware).toBeCalledTimes(4);
      expect(expoJudgeAccessMiddleware).toBeCalledTimes(4);
    });
  });
});
