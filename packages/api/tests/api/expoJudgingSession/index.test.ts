import express from 'express';
import supertest from 'supertest';
import { createMockHandler } from '../../testUtils/expressHelpers/createMockHandler';
import { createMockNext } from '../../testUtils/expressHelpers/createMockNext';
import { adminMiddleware } from '../../../src/middleware/adminMiddleware';
import { getMock } from '../../testUtils/getMock';

jest.mock('../../../src/api/expoJudgingSession/post', () => ({
  post: createMockHandler(),
}));

jest.mock('../../../src/middleware/adminMiddleware', () => ({
  adminMiddleware: createMockNext(),
}));

jest.mock('../../../src/api/expoJudgingSession/post', () => ({
  post: createMockHandler(),
}));

const mockAdminMiddleware = getMock(adminMiddleware);

describe('/expoJudgingSession post endpoint registration', () => {
  it('uses adminMiddleware and registers the route for the handler', async () => {
    await jest.isolateModulesAsync(async () => {
      const { expoJudgingSession } = await import('../../../src/api/expoJudgingSession');

      const app = express();
      app.use(expoJudgingSession);
      const res = await supertest(app).post('');
      expect(res.status).toEqual(200);
      expect(mockAdminMiddleware).toBeCalledTimes(1);
    });
  });
});
