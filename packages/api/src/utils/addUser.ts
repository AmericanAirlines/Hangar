import { Request, Response } from 'express';
import { User } from '@hangar/database';

export const addUser = async ( req: Request, res: Response, next:Function ) => {
  const email = req.session?.email;
  const userQuery = { email };
  
  if (!email) {
    // User does not have a valid session
    res.sendStatus(401);
    return;
  }
  
  const user = await req.entityManager.findOne( User, userQuery );
  if (user) {
    req.user = user;
  }
  else {
    // User does not exist in the database
    res.sendStatus(403);
    return;
  }
  
  next();
}
