import express, { Request, Response } from 'express';
import supertest from 'supertest';
import { createMockNext } from '../../../testUtils/createMockNext';
import { getMock } from '../../../testUtils/getMock';
import { mountUserMiddleware } from '../../../../src/middleware/mountUserMiddleware';

jest.mock('../../../../src/api/users/me/get', () => ({
  get: (req: Request, res: Response) => {
    res.sendStatus(200);
  },
}));

jest.mock('../../../../src/middleware/mountUserMiddleware', () => ({
  mountUserMiddleware: createMockNext(),
}));

const mountUserMiddlewareMock = getMock(mountUserMiddleware);

describe('/users/me is returning a user from request body', () => {
  it('uses mountUserMiddleware', async () => {
    await jest.isolateModulesAsync(async () => {
      const { me } = require('../../../../src/api/users/me');

      const app = express();
      app.use(me);
      const res = await supertest(app).get('');
      expect(res.status).toEqual(200);
      expect(mountUserMiddlewareMock).toBeCalledTimes(1);
    });
  });
});