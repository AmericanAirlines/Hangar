import { Request, Response } from 'express';

export const mockUser = {
  firstName: 'a',
  lastName: 'b',
  email: 'a@b.c',
  project:undefined
};

export const mockReq:any = {
  session: {
    email: ''
  },
  entityManager: {
    findOne: jest.fn(()=>{
      return mockReq.session.email === 'pancakes@waffles.bananas'
        ? mockUser
        : null
    })
  } ,
  user: null
};

export const mockRes = {
  sendStatus: jest.fn()
};

export const mockNext = jest.fn();

export const post = (req: Request, res: Response) => {
  res.sendStatus(200);
}