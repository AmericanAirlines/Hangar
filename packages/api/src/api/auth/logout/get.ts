import { Request, Response } from 'express';

export const get = (req: Request, res: Response) => {
  req.session = null;
  res.redirect('/');
};
