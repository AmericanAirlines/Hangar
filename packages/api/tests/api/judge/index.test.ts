import express from 'express';
import supertest from 'supertest';
import { getMock } from '../../testUtils/getMock';
import { createMockHandler } from '../../testUtils/expressHelpers/createMockHandler';
import { createMockNext } from '../../testUtils/expressHelpers/createMockNext';
import { mountUserMiddleware } from '../../../src/middleware/mountUserMiddleware';
import { judgeMiddleware } from '../../../src/middleware/judgeMiddleware';

jest.mock('../../../src/api/judge/post', () => ({
  post: createMockHandler(),
}));

jest.mock('../../../src/api/judge/put', () => ({
  put: createMockHandler(),
}));

jest.mock('../../../src/middleware/mountUserMiddleware', () => ({
  mountUserMiddleware: createMockNext(),
}));

jest.mock('../../../src/middleware/judgeMiddleware', () => ({
  judgeMiddleware: createMockNext(),
}));

const mountUserMiddlewareMock = getMock(mountUserMiddleware);
const judgeMiddlewareMock = getMock(judgeMiddleware);

describe('/judge post endpoint registration', () => {
  it('uses mountUserMiddleware and registers the POST route for the handler', async () => {
    await jest.isolateModulesAsync(async () => {
      const { judge } = await import('../../../src/api/judge');

      const app = express();
      app.use(judge);
      const res = await supertest(app).post('');

      expect(mountUserMiddlewareMock).toBeCalledTimes(1);
      expect(res.status).toEqual(200);
    });
  });

  it('uses judgeMiddleware to find the registered judge for PUT endpoint', async () => {
    await jest.isolateModulesAsync(async () => {
      const { judge } = await import('../../../src/api/judge');

      const app = express();
      app.use(judge);
      const res = await supertest(app).put('');

      expect(judgeMiddlewareMock).toBeCalledTimes(1);
      expect(res.status).toEqual(200);
    });
  });
});
