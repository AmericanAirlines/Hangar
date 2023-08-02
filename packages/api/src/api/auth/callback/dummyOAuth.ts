/* istanbul ignore file */
export type OAuthArgs = {
  email: string;
  given_name: string;
  family_name: string;
};
export const dummyOAuth = ({
  /* req,
  res, 
  data, */
  email,
  given_name: firstName,
  family_name: lastName,
}: OAuthArgs) => ({ email, firstName, lastName });
