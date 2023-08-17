import express, { Request, Response } from 'express';
import supertest from 'supertest';
import { createMockNext } from '../../testUtils/createMockNext';
import { getMock } from '../../testUtils/getMock';
import { sessionMiddleware } from '../../../src/middleware/sessionMiddleware';

jest.mock('../../../src/api/users/post', () => ({
  post: (req: Request, res: Response) => {
    res.sendStatus(200);
  },
}));

jest.mock('../../../src/middleware/sessionMiddleware', () => ({
  sessionMiddleware: createMockNext(),
}));

const sessionMiddlewareMock = getMock(sessionMiddleware);

describe('/users router registrations', () => {
  it('uses sessionMiddleware', async () => {
    await jest.isolateModulesAsync(async () => {
      const { users } = require('../../../src/api/users');

      const app = express();
      app.use(users);
      const res = await supertest(app).post('');
      expect(sessionMiddlewareMock).toBeCalledTimes(1);
      expect(res.status).toEqual(200);
    });
  });
});