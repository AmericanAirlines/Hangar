import { NextRouter } from 'next/router';
import { openErrorToast } from '../../components/utils/CustomToast';
import { createOrUpdateJudge } from './createOrUpdateJudge';
import { triggerRedirect } from '../../components/layout/RedirectToAuthModal';

type HandleFetchErrorArgs = {
  router: NextRouter;
  status: number;
  inviteCode?: string;
  originalUrl: string;
  onJudgeAccessSuccess: () => void;
};

export const handleFetchError = async ({
  router,
  status,
  inviteCode,
  originalUrl,
  onJudgeAccessSuccess,
}: HandleFetchErrorArgs) => {
  if (status === 404) {
    openErrorToast({ title: 'Judging Session Not Found' });
    return;
  }

  if (status === 401) {
    void triggerRedirect({ returnTo: originalUrl });
    return;
  }

  if (status === 403) {
    // User is authenticated but is NOT a judge or does NOT have access
    if (!inviteCode) {
      // User doesn't have access and no invite code was present
      openErrorToast({
        title: 'Access Denied',
        description:
          'You do not have access to that Judging Session; please contact an administrator if you think this is an error',
      });
      void router.push('/');
      return;
    }

    // Invite code is present and user doesn't have access; provide access
    try {
      await createOrUpdateJudge({ inviteCode });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to create or update judge: ', error);

      openErrorToast({
        title: `Unable to join Judging Session`,
        description: 'An unexpected error occurred',
      });
      return;
    }

    onJudgeAccessSuccess();
    return;
  }

  // All other status codes
  openErrorToast({
    title: 'Failed to fetch Judging Session details',
    description: 'An unexpected error occurred',
  });
  void router.push('/');
};
