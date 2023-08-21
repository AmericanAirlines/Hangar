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

jest.mock('../../../src/middleware/mountUserMiddleware', () => ({
  validateSessionMountUser: [createMockNext(), createMockNext()],
}));

const sessionMiddlewareMock = getMock(sessionMiddleware);

describe('/users router registrations', () => {
  describe('post registration', () => {
    it('uses sessionMiddleware', async () => {
      await jest.isolateModulesAsync(async () => {
        const { users } = await import('../../../src/api/users');

        const app = express();
        app.use(users);
        const res = await supertest(app).post('');
        expect(sessionMiddlewareMock).toBeCalledTimes(1);
        expect(res.status).toEqual(200);
      });
    });
  });

  describe('me router registration', () => {
    it('uses mountUserMiddleware', async () => {
      await jest.isolateModulesAsync(async () => {
        const { me } = await import('../../../src/api/users/me');

        const app = express();
        app.use(me);
        const res = await supertest(app).get('');
        expect(res.status).toEqual(200);
      });
    });
  });
});
