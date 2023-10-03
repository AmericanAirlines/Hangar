import { NextRouter } from 'next/router';
import { openErrorToast } from '../../../components/utils/CustomToast';

type HandleFetchErrorArgs = {
  router: NextRouter;
  status: number;
  inviteCode?: string;
  onJudgeAccessSuccess: () => void;
};

export const handleFetchError = ({
  router,
  status,
  inviteCode,
  onJudgeAccessSuccess,
}: HandleFetchErrorArgs) => {
  if (status === 404) {
    openErrorToast({ title: 'Expo Judging Session Not Found' });
    return;
  }

  if (status === 401 || status === 403) {
    // User is not a judge
    if (!inviteCode) {
      // User doesn't have access and no invite code was present
      openErrorToast({
        title: 'Access Denied',
        description:
          'You do not have access to that Expo Judging Session; please contact an administrator if you think this is an error',
      });
      void router.push('/');
      return;
    }

    // Invite code is present and user doesn't have access; provide access
    onJudgeAccessSuccess();
  }

  // All other status codes
  openErrorToast({
    title: 'Failed to fetch Expo Judging Session details',
    description: 'An unexpected error occurred',
  });
};
