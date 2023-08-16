import express, { Request, Response } from 'express';
import supertest from 'supertest';
import { addUser } from '../../src/utils/addUser';
jest.mock('../../src/api/users/post', () => ({
  post: (req: Request, res: Response) => {
    res.sendStatus(200);
  },
}));


const mockReq = {
  session: {
    email: ''
  },
  entityManager: {
    findOne: jest.fn()
  } ,
  user: null
}
const mockRes = {
  sendStatus: jest.fn()
}
const mockNext = jest.fn()

describe('mounting user on /user', () => {
  it('calls next when a valid session is found', async () => {
    await jest.isolateModulesAsync(async () => {
      const { users } = await import('../../src/api/users');

      const router = express();

      router.use((req, res, next) => {
        req.session = { email: 'pancakes@waffles.bananas' } as any;
        next();
      }, users);

      const res = await supertest(router).post('/');
      expect(res.statusCode).toBe(200);
    });
  });
  
  it('returns a 401 when a valid session cannot be found', async () => {
    await jest.isolateModulesAsync(async () => {
      const { users } = await import('../../src/api/users');
      
      const router = express();
      router.use(users);
      
      const res = await supertest(router).post('/');
      expect(res.statusCode).toEqual(401);
    });
  });
  
  it('adds a user to the request when a valid session is found', async () => {
    // setup
    // test
    await addUser(mockReq as unknown as Request, mockRes as unknown as Response, mockNext);
    // await addUser( mockReq as any, mockRes as any, mockNext );

    // assert
    expect(mockReq.user).toBeDefined();

  });
  it('returns a 403 when a valid session is found but the user is not authorized', async () => {
    // setup
    // test
    await addUser( mockReq as any, mockRes as any, mockNext );
    // assert
    expect(mockRes.sendStatus).toHaveBeenCalledWith(403);
  });
});