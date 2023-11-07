import React from 'react';
import { useRouter } from 'next/router';
import { Center, Flex, Heading } from '@chakra-ui/react';
import { ProjectCard } from '../ProjectCard/ProjectCard';
import { useExpoJudging } from '../hooks/useExpoJudging';
import { PageSpinner } from '../../layout/PageSpinner';
import { ExpoJudgingIntro } from '../ExpoJudgingIntro';

type ProjectCardsContainerProps = {};

export const ProjectCardsContainer: React.FC<ProjectCardsContainerProps> = () => {
  const router = useRouter();
  const { isLoading, previousProject, currentProject, expoJudgingSessionId, continueToNext } =
    useExpoJudging();

  React.useEffect(() => {
    if (previousProject && !currentProject) {
      // Judging has finished
      void router.push(`/judgingSessionComplete`);
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
      gap={{ base: 5, md: 10 }}
      w="100%"
    >
      {isAtStart ? (
        <ExpoJudgingIntro onStart={continueToNext} />
      ) : (
        <>
          <ProjectCard type="Current" />
          {previousProject && (
            <Center>
              <Heading mb={{ base: 8, md: 50 }}>VS</Heading>
            </Center>
          )}
          <ProjectCard type="Previous" />
        </>
      )}
    </Flex>
  );
};
