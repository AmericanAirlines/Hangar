import React from 'react';
import { NextPage } from 'next';
import { Select } from '@chakra-ui/react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { useJudgingSessionFetcher } from '../../../pageUtils/judgingSession';
import { useCriteriaJudging } from '../../../components/CriteriaJudging/hooks/useCriteriaJudging';

const CriteriaJudgingSessionDetails: NextPage = () => {
  const { criteriaJudgingSession } = useJudgingSessionFetcher({ sessionType: 'criteria' });
  const { projects, isLoading } = useCriteriaJudging();

  React.useEffect(() => {
    if (criteriaJudgingSession) {
      useCriteriaJudging.getState().init({ criteriaJudgingSessionId: criteriaJudgingSession.id });
    }
  }, [criteriaJudgingSession]);

  return (
    <PageContainer
      pageTitle={'Criteria Judging'}
      heading={'Criteria Judging'}
      isLoading={!criteriaJudgingSession || isLoading}
    >
      <Select placeholder="Select a Project">
        {projects?.map((project) => (
          <option key={project.id} value={project.name}>
            {project.name}
          </option>
        ))}
      </Select>
    </PageContainer>
  );
};

export default CriteriaJudgingSessionDetails;
