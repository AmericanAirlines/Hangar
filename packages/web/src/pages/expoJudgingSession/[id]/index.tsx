import React from 'react';
import { NextPage } from 'next';
import { PageContainer } from '../../../components/layout/PageContainer';
import { useExpoJudgingSessionFetcher } from '../../../pageUtils/expoJudgingSession/[id]/useExpoJudgingSessionFetcher';
import { ProjectCardsContainer, useExpoJudging } from '../../../components/ExpoJudging';

const ExpoJudgingSessionDetails: NextPage = () => {
  const { expoJudgingSession } = useExpoJudgingSessionFetcher();
  React.useEffect(() => {
    if (expoJudgingSession) {
      useExpoJudging.getState().init({ expoJudgingSessionId: expoJudgingSession.id });
    }
  }, [expoJudgingSession]);

  return (
    <PageContainer
      pageTitle={'Expo Judging'}
      heading={'Expo Judging'}
      isLoading={!expoJudgingSession}
    >
      <ProjectCardsContainer />
    </PageContainer>
  );
};

export default ExpoJudgingSessionDetails;
