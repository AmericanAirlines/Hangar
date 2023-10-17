import React from 'react';
import { Button, Flex, Heading } from '@chakra-ui/react';
import { ProjectCard } from '../ProjectCard/ProjectCard';
import { useExpoJudging } from '../hooks/useExpoJudging';
import { PageSpinner } from '../../layout/PageSpinner';

type ProjectCardsContainerProps = {};

export const ProjectCardsContainer: React.FC<ProjectCardsContainerProps> = () => {
  const { isLoading, previousProject, currentProject, continueToNext } = useExpoJudging();

  const isAtStart = !previousProject && !currentProject;

  const start = () => {
    void continueToNext();
  };

  if (isLoading) return <PageSpinner />;

  return (
    <Flex
      direction={{ base: 'column', sm: 'row' }}
      alignItems="top"
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
