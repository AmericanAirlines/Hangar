import { Response, Request } from 'express';

export type OAuthUserData = {
  email: string;
  firstName: string;
  lastName: string;
};

type AuthenticateArgs = {
  req: Request;
  res: Response;
  data: OAuthUserData;
};

export const authenticateUser = ({ data, req, res }: AuthenticateArgs) => {
  req.session = data;

  res.redirect('/');
};
