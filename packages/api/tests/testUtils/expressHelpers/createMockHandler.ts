import { Request, Response } from 'express';

export const createMockHandler = (status = 200) =>
  jest.fn((req: Request, res: Response) => {
    res.sendStatus(status);
  });
