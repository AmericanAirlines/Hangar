import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { ExpoJudgingSession } from '@hangar/shared';
import { PageContainer } from '../../../components/layout/PageContainer';
import { fetchJudgingSession } from '../../../utils/fetchJudgingSession';

const ExpoJudgingSessionDetails: NextPage = () => {
  const initialFetchMadeRef = React.useRef(false);
  const inviteCodeHandledRef = React.useRef(false);
  const [ejsFetchComplete, setEjsFetchComplete] = React.useState(false);
  const [expoJudgingSession, setExpoJudgingSession] = React.useState<ExpoJudgingSession>();
  const router = useRouter();

  React.useEffect(() => {
    if (ejsFetchComplete && !inviteCodeHandledRef.current && router.isReady) {
      // Router is ready to be reviewed and we haven't yet handled the query params
      inviteCodeHandledRef.current = true;
      if (router.query) {
        /* empty */
      }
    }
  }, [ejsFetchComplete, router.isReady, router.query]);

  React.useEffect(() => {
    const fetchEjs = async () => {
      initialFetchMadeRef.current = true;

      setExpoJudgingSession(
        await fetchJudgingSession({
          expoJudgingSessionId: router.query.id as string,
          showError: !router.query.inviteCode,
        }),
      );

      setEjsFetchComplete(true);
    };

    if (!initialFetchMadeRef.current && router.isReady) void fetchEjs();
  }, [router.isReady, router.query.id, router.query.inviteCode]);

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
