import express, { Request, Response } from 'express';
import supertest from 'supertest';
import { createMockHandler } from '../../../testUtils/expressHelpers/createMockHandler';
import { getMock } from '../../../testUtils/getMock';
import { get } from '../../../../src/api/admin/me/get';

jest.mock('../../../../src/api/admin/me/get', () => ({
  get: createMockHandler(),
}));

const mockGet = getMock(get);

describe('/admin/me route', () => {
  it('uses adminMiddleware and registers the admin for the me handler', async () => {
    await jest.isolateModulesAsync(async () => {
      const { me } = await import('../../../../src/api/admin/me');

      const app = express();
      app.use(me);
      const res = await supertest(app).get('');
      expect(res.status).toEqual(200);
      expect(mockGet).toBeCalled();
    });
  });
});
