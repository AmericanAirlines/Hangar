/* istanbul ignore file */
export type OAuthArgs = {
  email: string;
  firstName: string;
  lastName: string;
};
export const dummyOAuth = ({
  /* req,
  res, 
  data, */
  email,
  firstName,
  lastName,
}: OAuthArgs) => ({ email, firstName, lastName });
