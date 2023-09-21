import express from 'express';
import supertest from 'supertest';
import { getMock } from '../../testUtils/getMock';
import { createMockHandler } from '../../testUtils/expressHelpers/createMockHandler';
import { createMockNext } from '../../testUtils/expressHelpers/createMockNext';
import { mountUserMiddleware } from '../../../src/middleware/mountUserMiddleware';

jest.mock('../../../src/api/judge/post', () => ({
  post: createMockHandler(),
}));

jest.mock('../../../src/middleware/mountUserMiddleware', () => ({
  mountUserMiddleware: createMockNext(),
}));

const mountUserMiddlewareMock = getMock(mountUserMiddleware);

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
});
