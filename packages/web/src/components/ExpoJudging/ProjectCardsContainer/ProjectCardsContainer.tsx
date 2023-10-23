import React from 'react';
import { useRouter } from 'next/router';
import { Flex } from '@chakra-ui/react';
import { ProjectCard } from '../ProjectCard/ProjectCard';
import { useExpoJudging } from '../hooks/useExpoJudging';
import { PageSpinner } from '../../layout/PageSpinner';
import JudgingIntro from '../../../pages/judgingIntro';

type ProjectCardsContainerProps = {};

export const ProjectCardsContainer: React.FC<ProjectCardsContainerProps> = () => {
  const router = useRouter();
  const { isLoading, previousProject, currentProject, expoJudgingSessionId } = useExpoJudging();

  React.useEffect(() => {
    if (previousProject && !currentProject) {
      // Judging has finished
      void router.push(`/expoJudgingSession/${expoJudgingSessionId}/sessionComplete`);
    }
  }, [previousProject, currentProject, router, expoJudgingSessionId]);

  const isAtStart = !previousProject && !currentProject;
  const isAtEnd = previousProject && !currentProject;

  if (isLoading || isAtEnd) return <PageSpinner />;

  return (
    <Flex
      direction={{ base: 'column', md: 'row-reverse' }}
      alignItems="stretch"
      justifyContent="center"
      gap={20}
      w="100%"
    >
      {isAtStart ? (
        <>
          <JudgingIntro />
        </>
      ) : (
        <>
          <ProjectCard type="Current" />
          <ProjectCard type="Previous" />
        </>
      )}
    </Flex>
  );
};
