import express from 'express';
import supertest from 'supertest';
import { createMockHandler } from '../../../testUtils/expressHelpers/createMockHandler';
import { createMockNext } from '../../../testUtils/expressHelpers/createMockNext';
import { judgeMiddleware } from '../../../../src/middleware/judgeMiddleware';
import { getMock } from '../../../testUtils/getMock';

jest.mock('../../../../src/api/criteriaJudgingSession/id/get', () => ({
  get: createMockHandler(),
}));

jest.mock('../../../../src/middleware/judgeMiddleware', () => ({
  judgeMiddleware: createMockNext(),
}));

const mockJudgeMiddleware = getMock(judgeMiddleware);

describe('id router', () => {
  it('uses judgeMiddleware for judge routes', async () => {
    await jest.isolateModulesAsync(async () => {
      const { id } = await import('../../../../src/api/criteriaJudgingSession/id');

      const app = express();
      app.use(id);
      const res = await supertest(app).get('');
      expect(res.status).toEqual(200);

      expect(mockJudgeMiddleware).toBeCalledTimes(1);
    });
  });
});
