import React from 'react';
import { NextPage } from 'next';
import { PageContainer } from '../../components/layout/PageContainer';
import { CriteriaJudgingSessionForm } from '../../components/Admin/CriteriaJudgingSessionForm';

const CreateCriteriaJudgingSession: NextPage = () => {
  React.useEffect(() => {}, []);

  return (
    <PageContainer
      pageTitle="Create Criteria Judging Session"
      heading={'Create Criteria Judging Session'}
    >
      <CriteriaJudgingSessionForm />
    </PageContainer>
  );
};

export default CreateCriteriaJudgingSession;
