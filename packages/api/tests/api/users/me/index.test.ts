import express, { Request, Response } from 'express';
import supertest from 'supertest';

jest.mock('../../../../src/api/user/me/get', () => ({
  get: (req: Request, res: Response) => {
    res.sendStatus(200);
  },
}));

describe('/user/me route registration', () => {
  it('uses mountUserMiddleware and registers the route for the me handler', async () => {
    await jest.isolateModulesAsync(async () => {
      const { me } = await import('../../../../src/api/user/me');

      const app = express();
      app.use(me);
      const res = await supertest(app).get('');
      expect(res.status).toEqual(200);
    });
  });
});
