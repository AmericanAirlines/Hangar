import { User } from '@hangar/database';
import { Response, Request } from 'express';
import { logger } from './logger';

export type OAuthUserData = {
  email: string;
  firstName: string;
  lastName: string;
  returnTo?: string;
};

type AuthenticateArgs = {
  req: Request;
  res: Response;
  data: OAuthUserData;
};

/**
 * Handles a recently validated session creation and identifies an existing user or creates one if needed
 * @param context info about the current request/response and data for the user to authenticate
 */
export const authenticateUser = async ({ data, req, res }: AuthenticateArgs) => {
  const { entityManager: em } = req;

  try {
    const existingUser = await em.findOne(User, { email: data.email });
    if (existingUser) {
      req.session = { id: existingUser.id };
    } else {
      const newUser = new User(data);
      await em.persistAndFlush(newUser);
      req.session = { id: newUser.id };
    }
    
    if (data.returnTo && data.returnTo.startsWith('/')) {
      res.redirect( data.returnTo );
    }
    else{
      res.redirect( '/' );
    }

  } catch (error) {
    logger.error(error);
    res.redirect('/error?description=Failed to resolve identity');
  }
};
