import React from 'react';
import { Code } from '@chakra-ui/react';
import { NextPage } from 'next';
import { PageContainer } from '../../../components/layout/PageContainer';
import { useExpoJudgingSessionFetcher } from '../../../pageUtils/expoJudgingSession/[id]/useExpoJudgingSessionFetcher';

const ExpoJudgingSessionDetails: NextPage = () => {
  const { expoJudgingSession } = useExpoJudgingSessionFetcher();

  return (
    <PageContainer
      pageTitle={'Expo Judging'}
      heading={'Expo Judging'}
      isLoading={!expoJudgingSession}
    >
      <Code whiteSpace="pre" p={5}>
        {JSON.stringify(expoJudgingSession, null, 2)}
      </Code>
    </PageContainer>
  );
};

export default ExpoJudgingSessionDetails;
