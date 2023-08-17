import express from 'express';
import supertest from 'supertest';
import { post } from '../../middleware/mockData';

jest.mock('../../../src/api/users/post', () => ({ post }));

describe('/users router registrations', () => {
  describe('post requests', () => {
    it('returns a 401 when a valid session cannot be found', async () => {
      await jest.isolateModulesAsync(async () => {
        const { users } = require('../../../src/api/users');
        
        const router = express();
        router.use(users);
        
        const res = await supertest(router).post('/');
        expect(res.statusCode).toEqual(401);
      });
    });
  });
});