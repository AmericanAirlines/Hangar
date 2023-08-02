/* istanbul ignore file */
export type OAuthArgs = {
  req: Request;
  res: Response;
  data: {
    email: string;
    given_name: string;
    family_name: string;
  };
};
export const dummyOAuth = ({
  /* req,
  res, */
  data: { email, given_name: firstName, family_name: lastName },
}: OAuthArgs) => {
  console.log('Args: ', email, firstName, lastName);
  // contains req, res, data (info stored in data)
  return { email, firstName, lastName };
};
