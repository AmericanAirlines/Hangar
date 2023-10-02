import express from 'express';
import supertest from 'supertest';
import { createMockHandler } from '../../testUtils/expressHelpers/createMockHandler';
import { createMockNext } from '../../testUtils/expressHelpers/createMockNext';
import { judgeMiddleware } from '../../../src/middleware/judgeMiddleware';
import { getMock } from '../../testUtils/getMock';

jest.mock('../../../src/api/expoJudgingVote/post', () => ({
  post: createMockHandler(),
}));

jest.mock('../../../src/middleware/judgeMiddleware', () => ({
  judgeMiddleware: createMockNext(),
}));

const mockJudgeMiddleware = getMock(judgeMiddleware);

describe('/expoJudgingVote post endpoint registration', () => {
  it('uses judgeMiddleware and registers the POST route for the handler', async () => {
    await jest.isolateModulesAsync(async () => {
      const { expoJudgingVote } = await import('../../../src/api/expoJudgingVote');

      const app = express();
      app.use(expoJudgingVote);
      const res = await supertest(app).post('');
      expect(res.status).toEqual(200);
      expect(mockJudgeMiddleware).toBeCalledTimes(1);
    });
  });
});
