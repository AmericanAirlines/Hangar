import express from 'express';
import supertest from 'supertest';
import { createMockNext } from '../../testUtils/expressHelpers/createMockNext';
import { getMock } from '../../testUtils/getMock';
import { mountUserMiddleware } from '../../../src/middleware/mountUserMiddleware';
import { createMockHandler } from '../../testUtils/expressHelpers/createMockHandler';

jest.mock('../../../src/api/user/put', () => ({
  put: createMockHandler(),
}));

jest.mock('../../../src/api/user/me', () => ({
  me: createMockHandler(),
}));

jest.mock('../../../src/middleware/mountUserMiddleware', () => ({
  mountUserMiddleware: createMockNext(),
}));

const mountUserMiddlewareMock = getMock(mountUserMiddleware);

describe('/users router registrations', () => {
  describe('post registration', () => {
    it('uses mountUserMiddleware', async () => {
      await jest.isolateModulesAsync(async () => {
        const { users } = await import('../../../src/api/user');

        const app = express();
        app.use(users);
        const res = await supertest(app).put('');
        expect(mountUserMiddlewareMock).toBeCalledTimes(1);
        expect(res.status).toEqual(200);
      });
    });
  });

  describe('me registration', () => {
    it('uses mountUserMiddleware', async () => {
      await jest.isolateModulesAsync(async () => {
        const { users } = await import('../../../src/api/user');

        const app = express();
        app.use(users);
        const res = await supertest(app).get('/me');
        expect(mountUserMiddlewareMock).toBeCalledTimes(1);
        expect(res.status).toEqual(200);
      });
    });
  });
});
