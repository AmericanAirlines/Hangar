import React from 'react';
import { useRouter } from 'next/router';
import { Button, Flex, Heading } from '@chakra-ui/react';
import { ProjectCard } from '../ProjectCard/ProjectCard';
import { useExpoJudging } from '../hooks/useExpoJudging';
import { PageSpinner } from '../../layout/PageSpinner';

type ProjectCardsContainerProps = {};

export const ProjectCardsContainer: React.FC<ProjectCardsContainerProps> = () => {
  const router = useRouter();
  const { isLoading, previousProject, currentProject, continueToNext, expoJudgingSessionId } =
    useExpoJudging();

  React.useEffect(() => {
    if (previousProject && !currentProject) {
      // Judging has finished
      void router.push(`/expoJudgingSession/${expoJudgingSessionId}/sessionComplete`);
    }
  }, [previousProject, currentProject, router, expoJudgingSessionId]);

  const isAtStart = !previousProject && !currentProject;
  const isAtEnd = previousProject && !currentProject;

  const start = () => {
    void continueToNext();
  };

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
          {/* TODO: Create a proper Start component and add it here */}
          <Flex direction="column" gap={5}>
            <Heading>Start Judging</Heading>
            <Button isLoading={isLoading} onClick={start}>
              Continue
            </Button>
          </Flex>
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
