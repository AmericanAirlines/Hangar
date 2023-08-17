import { Request, Response } from 'express';
import { User } from '@hangar/database';

export const addUser = async ( req: Request, res: Response, next:Function ) => {
  const id = req.session?.id;
  const userQuery = { id };
  
  if (!id) {
    // User does not have a valid session
    res.sendStatus(401);
    return;
  }
  
  let user;
  try {
    user = await req.entityManager.findOne( User, userQuery );
  }
  catch {
    res.sendStatus(500);
    return;
  }

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
