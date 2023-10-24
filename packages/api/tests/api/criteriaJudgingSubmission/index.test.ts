import express from 'express';
import supertest from 'supertest';
import { createMockHandler } from '../../testUtils/expressHelpers/createMockHandler';
import { createMockNext } from '../../testUtils/expressHelpers/createMockNext';
import { getMock } from '../../testUtils/getMock';
import { judgeMiddleware } from '../../../src/middleware/judgeMiddleware';

jest.mock('../../../src/api/criteriaJudgingSubmission/post', () => ({
  post: createMockHandler(),
}));

jest.mock('../../../src/middleware/judgeMiddleware', () => ({
  judgeMiddleware: createMockNext(),
}));

const mockJudgeMiddleware = getMock(judgeMiddleware);

describe('criteriaJudgingSubmission router', () => {
  it('uses judgeMiddleware and registers the POST route for the handler', async () => {
    await jest.isolateModulesAsync(async () => {
      const { criteriaJudgingSubmission } = await import(
        '../../../src/api/criteriaJudgingSubmission'
      );

      const app = express();
      app.use(criteriaJudgingSubmission);
      const res = await supertest(app).post('');
      expect(res.status).toEqual(200);
      expect(mockJudgeMiddleware).toBeCalledTimes(1);
    });
  });
});
