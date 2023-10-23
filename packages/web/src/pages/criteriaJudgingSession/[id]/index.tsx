import React from 'react';
import { NextPage } from 'next';
import { PageContainer } from '../../../components/layout/PageContainer';
import { useJudgingSessionFetcher } from '../../../pageUtils/judgingSession';

const CriteriaJudgingSessionDetails: NextPage = () => {
  const { criteriaJudgingSession } = useJudgingSessionFetcher({ sessionType: 'criteria' });

  return (
    <PageContainer
      pageTitle={'Criteria Judging'}
      heading={'Criteria Judging'}
      isLoading={!criteriaJudgingSession}
    >
      TBD
    </PageContainer>
  );
};

export default CriteriaJudgingSessionDetails;
