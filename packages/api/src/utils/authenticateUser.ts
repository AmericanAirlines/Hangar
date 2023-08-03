import { Response, Request } from 'express';

export type OAuthUserData = {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  address?: string;
  given_name?: string;
  family_name?: string;
};
type AuthenticateArgs = {
  req: Request;
  res: Response;
  data: OAuthUserData;
};
export const authenticateUser = ({ data, req, res }: AuthenticateArgs) => {
  // validate the request has a valid OAuthUserData object
  // if so, add it to the session
  // if not, redirect to error
  if (data.email) {
    req.session = data;
    res.redirect('/');
  } else {
    res.redirect('/error');
  }
};
