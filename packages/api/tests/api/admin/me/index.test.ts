import express, { Request, Response } from 'express';
import supertest from 'supertest';

jest.mock('../../../../src/api/admin/me/get', () => ({
  get: (req: Request, res: Response) => {
    res.sendStatus(200);
  },
}));

describe('/admin/me route', () => {
  it('uses adminMiddleware and registers the admin for the me handler', async () => {
    await jest.isolateModulesAsync(async () => {
      const { me } = await import('../../../../src/api/admin/me');

      const app = express();
      app.use(me);
      const res = await supertest(app).get('');
      expect(res.status).toEqual(200);
    });
  });
});
