import { Request, Response } from 'express';

export const validateSession = async ( req: Request, res: Response, next:Function ) => {
  const id = req.session?.id;
  
  if (!id) {
    // Client does not have a valid session
    res.sendStatus(401);
    return;
  }
  
  next();
}

