import { Request, Response } from 'express';

export const mockUser = {
  firstName: 'a',
  lastName: 'b',
  email: 'a@b.c',
  project:undefined
};

export const mockReq:any = {
  session: {
    id: undefined
  },
  entityManager: {
    findOne: jest.fn((entity,query)=>{
      return query.id
        ? mockUser
        : undefined
    })
  } ,
  user: undefined
};

export const mockRes = {
  sendStatus: jest.fn()
};

export const mockNext = jest.fn();

export const post = (req: Request, res: Response) => {
  res.sendStatus(200);
}