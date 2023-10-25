import React from 'react';
import { NextPage } from 'next';
import { Project } from '@hangar/shared';
import { Center } from '@chakra-ui/react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { useJudgingSessionFetcher } from '../../../pageUtils/judgingSession';
import { ProjectSelectionMenu, useCriteriaJudging } from '../../../components/CriteriaJudging';
import { CriteriaJudgingForm } from '../../../components/CriteriaJudging/CriteriaJudgingForm';

const CriteriaJudgingSessionDetails: NextPage = () => {
  const [selectedProject, setSelectedProject] = React.useState<Project>();
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
      heading={criteriaJudgingSession?.title ?? ''}
      subHeading={criteriaJudgingSession?.description ?? ''}
      isLoading={!criteriaJudgingSession || isLoading}
    >
      {projects && <ProjectSelectionMenu projects={projects} onSelect={setSelectedProject} />}
      {selectedProject && criteriaJudgingSession ? (
        <CriteriaJudgingForm
          project={selectedProject}
          criteriaJudgingSession={criteriaJudgingSession}
        />
      ) : (
        <Center p={5} w="full">
          Select a project to begin judging...
        </Center>
      )}
    </PageContainer>
  );
};

export default CriteriaJudgingSessionDetails;
