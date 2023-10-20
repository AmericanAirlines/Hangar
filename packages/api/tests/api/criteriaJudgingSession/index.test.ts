import express from 'express';
import supertest from 'supertest';
import { createMockHandler } from '../../testUtils/expressHelpers/createMockHandler';
import { createMockNext } from '../../testUtils/expressHelpers/createMockNext';
import { adminMiddleware } from '../../../src/middleware/adminMiddleware';
import { getMock } from '../../testUtils/getMock';

jest.mock('../../../src/api/criteriaJudgingSession/post', () => ({
  post: createMockHandler(),
}));

jest.mock('../../../src/middleware/adminMiddleware', () => ({
  adminMiddleware: createMockNext(),
}));

const mockAdminMiddleware = getMock(adminMiddleware);

describe('/expoJudgingSession post endpoint registration', () => {
  it('uses adminMiddleware and registers the POST route for the handler', async () => {
    await jest.isolateModulesAsync(async () => {
      const { criteriaJudgingSession } = await import('../../../src/api/criteriaJudgingSession');

      const app = express();
      app.use(criteriaJudgingSession);
      const res = await supertest(app).post('');
      expect(res.status).toEqual(200);
      expect(mockAdminMiddleware).toBeCalledTimes(1);
    });
  });
});
