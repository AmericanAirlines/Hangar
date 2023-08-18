import { Request, Response } from 'express';

export const returnUser = (req: Request, res: Response) => {
  res.json(req.user);
};
