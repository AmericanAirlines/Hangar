import React from 'react';
import { NextPage } from 'next';
import { PageContainer } from '../../components/layout/PageContainer';
import { ExpoJudgingSessionForm } from '../../components/Admin/ExpoJudgingSessionForm';

const CreateExpoJudgingSession: NextPage = () => {
  React.useEffect(() => {}, []);

  return (
    <PageContainer pageTitle="Create Expo Judging Session" heading={'Create Expo Judging Session'}>
      <ExpoJudgingSessionForm />
    </PageContainer>
  );
};

export default CreateExpoJudgingSession;
