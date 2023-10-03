import React from 'react';
import { useRouter } from 'next/router';
import { ExpoJudgingSession } from '@hangar/shared';
import { fetchExpoJudgingSession } from './fetchExpoJudgingSession';
import { handleFetchError } from './handleFetchErrors';
import { openErrorToast } from '../../../components/utils/CustomToast';

const idRegexp = /^[a-z0-9]*$/i;

/**
 * A React hook for fetching an ExpoJudgingSession
 *
 * Handles invite codes automatically,
 * which in turn updates the URL when one is present.
 *
 * Failures are handled by toasts and redirects
 *
 * @returns an {@link ExpoJudgingSession}
 */
export const useExpoJudgingSessionFetcher = () => {
  const router = useRouter();
  const initialFetchMadeRef = React.useRef(false);
  const [expoJudgingSession, setExpoJudgingSession] = React.useState<ExpoJudgingSession>();

  React.useEffect(() => {
    const fetchEjs = async () => {
      initialFetchMadeRef.current = true;

      const expoJudgingSessionId = router.query.id as string;
      if (!idRegexp.test(expoJudgingSessionId)) {
        // Mitigate the risk of a SSRF
        openErrorToast({ title: 'Invalid Expo Judging Session ID' });
        return;
      }
      const response = await fetchExpoJudgingSession({
        expoJudgingSessionId,
      });

      const originalUrl = router.asPath;
      const { inviteCode, ...remainingQueryParams } = router.query;
      if (inviteCode) {
        // Prevent subsequent fetches from using the invite code again
        router.query = remainingQueryParams;
        // Update the URL to remove the invite code if it's present
        await router.push({ query: remainingQueryParams }, undefined, { shallow: true });
      }

      if ('status' in response) {
        const { status } = response;
        await handleFetchError({
          router,
          status,
          inviteCode: inviteCode as string,
          originalUrl,
          onJudgeAccessSuccess: () => {
            // Try again; failure will redirect to home with error toast
            void fetchEjs();
          },
        });
        return;
      }

      // Happy Path; EJS exists and page is ready
      setExpoJudgingSession(response);
    };

    if (!initialFetchMadeRef.current && router.isReady) void fetchEjs();
  }, [router]);

  return { expoJudgingSession };
};
