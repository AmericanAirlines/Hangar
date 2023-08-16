import express, { Request, Response } from 'express';
import supertest from 'supertest';

jest.mock('../../../src/api/users/post', () => ({
  post: (req: Request, res: Response) => {
    res.sendStatus(200);
  },
}));

describe('/users router registrations', () => {
  describe('post requests', () => {
    it('returns a 401 when a valid session cannot be found', async () => {
      await jest.isolateModulesAsync(async () => {
        const { users } = await import('../../../src/api/users');
        
        const router = express();
        router.use(users);

        const res = await supertest(router).post('/');
        expect(res.statusCode).toEqual(401);
      });
    });
  });
});
