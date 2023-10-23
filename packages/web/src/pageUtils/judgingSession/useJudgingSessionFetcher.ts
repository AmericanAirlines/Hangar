import React from 'react';
import { z } from 'zod';
import { useRouter } from 'next/router';
import { CriteriaJudgingSession, ExpoJudgingSession, JudgingSession, Schema } from '@hangar/shared';
import { FetchJudgingSessionArgs, fetchJudgingSession } from './fetchJudgingSession';
import { handleFetchError } from './handleFetchErrors';
import { openErrorToast } from '../../components/utils/CustomToast';

const idRegexp = /^[a-z0-9]*$/i;
const inviteCodeQueryParamKey: keyof z.infer<typeof Schema.judge.post> = 'inviteCode';
type UseJudgingSessionFetcherProps = Pick<FetchJudgingSessionArgs, 'sessionType'>;

/**
 * A React hook for fetching an JudgingSession
 *
 * Handles invite codes automatically,
 * which in turn updates the URL when one is present.
 *
 * Failures are handled by toasts and redirects
 *
 * @returns an {@link JudgingSession}
 */
export function useJudgingSessionFetcher(
  args: UseJudgingSessionFetcherProps & { sessionType: 'expo' },
): {
  expoJudgingSession: ExpoJudgingSession;
};
export function useJudgingSessionFetcher(
  args: UseJudgingSessionFetcherProps & { sessionType: 'criteria' },
): {
  criteriaJudgingSession: CriteriaJudgingSession;
};
export function useJudgingSessionFetcher({ sessionType }: UseJudgingSessionFetcherProps) {
  const router = useRouter();
  const initialFetchMadeRef = React.useRef(false);
  const [judgingSession, setJudgingSession] = React.useState<JudgingSession>();

  React.useEffect(() => {
    const fetchSession = async () => {
      initialFetchMadeRef.current = true;

      const judgingSessionId = router.query.id as string;
      if (!idRegexp.test(judgingSessionId)) {
        // Mitigate the risk of a SSRF
        openErrorToast({ title: 'Invalid Judging Session ID' });
        return;
      }
      const response = await fetchJudgingSession({
        judgingSessionId,
        // eslint-disable-next-line object-shorthand
        sessionType: 'criteria',
      });

      const originalUrl = router.asPath;
      const { [inviteCodeQueryParamKey]: inviteCode, ...remainingQueryParams } = router.query;
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
            void fetchSession();
          },
        });
        return;
      }

      // Happy Path; EJS exists and page is ready
      setJudgingSession(response);
    };

    if (!initialFetchMadeRef.current && router.isReady) void fetchSession();
  }, [router, sessionType]);

  return {
    [sessionType === 'expo' ? 'expoJudgingSession' : 'criteriaJudgingSession']: judgingSession,
  };
}
