import express from 'express';
import supertest from 'supertest';
import { createMockHandler } from '../../../testUtils/expressHelpers/createMockHandler';
import { createMockNext } from '../../../testUtils/expressHelpers/createMockNext';
import { judgeMiddleware } from '../../../../src/middleware/judgeMiddleware';
import { getMock } from '../../../testUtils/getMock';
import { criteriaJudgingSessionMiddleware } from '../../../../src/middleware/criteriaJudgingSessionMiddleware';
import { adminMiddleware } from '../../../../src/middleware/adminMiddleware';

jest.mock('../../../../src/api/criteriaJudgingSession/id/get', () => ({
  get: createMockHandler(),
}));

jest.mock('../../../../src/api/criteriaJudgingSession/id/results', () => ({
  results: createMockHandler(),
}));

jest.mock('../../../../src/middleware/judgeMiddleware', () => ({
  judgeMiddleware: createMockNext(),
}));

jest.mock('../../../../src/middleware/criteriaJudgingSessionMiddleware', () => ({
  criteriaJudgingSessionMiddleware: createMockNext(),
}));

jest.mock('../../../../src/middleware/adminMiddleware', () => ({
  adminMiddleware: createMockNext(),
}));

const mockJudgeMiddleware = getMock(judgeMiddleware);
const mockCriteriaJudgingSessionMiddleware = getMock(criteriaJudgingSessionMiddleware);
const mockAdminMiddleware = getMock(adminMiddleware);

describe('id router', () => {
  it('uses judgeMiddleware for judge routes', async () => {
    await jest.isolateModulesAsync(async () => {
      const { id } = await import('../../../../src/api/criteriaJudgingSession/id');

      const app = express();
      app.use(id);
      const res = await supertest(app).get('');
      expect(res.status).toEqual(200);

      expect(mockJudgeMiddleware).toBeCalledTimes(1);
      expect(mockCriteriaJudgingSessionMiddleware).toBeCalledTimes(1);
    });
  });

  it('uses adminMiddleware for admin routes', async () => {
    await jest.isolateModulesAsync(async () => {
      const { id } = await import('../../../../src/api/criteriaJudgingSession/id');

      const app = express();
      app.use(id);
      const res = await supertest(app).get('/results');
      expect(res.status).toEqual(200);

      expect(mockAdminMiddleware).toBeCalledTimes(1);
    });
  });
});
