import express, { Request, Response } from 'express';
import supertest from 'supertest';
import { createMockNext } from '../../../testUtils/createMockNext';
import { getMock } from '../../../testUtils/getMock';
import { sessionMiddleware } from '../../../../src/middleware/sessionMiddleware';

describe('Return the user from the request object', () => {
  it('calls next when a valid user is found', async () => {
    await jest.isolateModulesAsync(async () => {
      const { users } = require('../../../../src/api/users');

      const router = express();

      router.use((req, res, next) => {
        req.session = { email: 'pancakes@waffles.bananas' } as any;
        next();
      }, users);

      const res = await supertest(router).post('/');
      expect(res.statusCode).toBe(200);
    });
  });
  it('returns a 401 when a user/me is unsuccessful', async () => {
    await jest.isolateModulesAsync(async () => {
      const { users } = require('../../../../src/api/users');

      const router = express();
      router.use(users);

      const res = await supertest(router).post('/me');
      expect(res.statusCode).toEqual(401);
    });
  });
});
