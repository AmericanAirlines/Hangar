import { Config } from '@hangar/shared';

type SignInWithSlackArgs = {
  returnTo?: string;
};
export const signInWithSlack = async ({ returnTo }: SignInWithSlackArgs = {}) => {
  if (!returnTo) {
    window.location.href = `/api/auth`;
    return;
  }

  const returnToQuery = new URLSearchParams({
    [Config.global.authReturnUriParamName]: returnTo,
  }).toString();

  window.location.href = `/api/auth?${returnToQuery}`;
};
