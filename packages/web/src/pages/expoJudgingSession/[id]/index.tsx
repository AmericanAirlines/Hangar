import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { ExpoJudgingSession } from '@hangar/shared';
import { PageContainer } from '../../../components/layout/PageContainer';
import { fetchExpoJudgingSession } from '../../../pageUtils/expoJudgingSession/[id]/fetchExpoJudgingSession';
import { handleFetchError } from '../../../pageUtils/expoJudgingSession/[id]/handleFetchErrors';

const ExpoJudgingSessionDetails: NextPage = () => {
  const initialFetchMadeRef = React.useRef(false);
  const [expoJudgingSession, setExpoJudgingSession] = React.useState<ExpoJudgingSession>();
  const router = useRouter();

  React.useEffect(() => {
    const fetchEjs = async () => {
      initialFetchMadeRef.current = true;

      const response = await fetchExpoJudgingSession({
        expoJudgingSessionId: router.query.id as string,
      });

      const { inviteCode, ...remainingQueryParams } = router.query;
      if (inviteCode) {
        // Update the URL to remove the invite code if it's present
        void router.push({ query: remainingQueryParams }, undefined, { shallow: true });
      }

      if ('status' in response) {
        const { status } = response;
        handleFetchError({
          router,
          status,
          inviteCode: inviteCode as string,
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

  return (
    <PageContainer
      pageTitle={'Expo Judging'}
      heading={'Expo Judging'}
      isLoading={!expoJudgingSession}
    >
      <></>
    </PageContainer>
  );
};

export default ExpoJudgingSessionDetails;
