import express from 'express';
import supertest from 'supertest';
import { createMockNext } from '../../testUtils/expressHelpers/createMockNext';
import { getMock } from '../../testUtils/getMock';
import { adminMiddleware } from '../../../src/middleware/adminMiddleware';
import { createMockHandler } from '../../testUtils/expressHelpers/createMockHandler';

// jest.mock('../../../src/api/user/put', () => ({
//   put: createMockHandler(),
// }));

jest.mock('../../../src/api/admin/me', () => ({
  me: createMockHandler(),
}));

jest.mock('../../../src/middleware/adminMiddleware', () => ({
  adminMiddleware: createMockNext(),
}));

const adminMiddlewareMock = getMock(adminMiddleware);

describe('/admin router ', () => {
  describe('me registration', () => {
    it('uses adminMiddleware', async () => {
      await jest.isolateModulesAsync(async () => {
        const { user } = await import('../../../src/api/admin');

        const app = express();
        app.use(user);
        const res = await supertest(app).get('/me');
        expect(adminMiddlewareMock).toBeCalledTimes(1);
        expect(res.status).toEqual(200);
      });
    });
  });
});
