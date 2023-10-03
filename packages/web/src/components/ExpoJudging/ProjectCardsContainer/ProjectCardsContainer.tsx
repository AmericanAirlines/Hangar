import { Flex } from '@chakra-ui/react';
import { ProjectCard } from '../ProjectCard/ProjectCard';

type ProjectCardsContainerProps = {};

export const ProjectCardsContainer: React.FC<ProjectCardsContainerProps> = () => (
  <Flex
    direction={{ base: 'column', sm: 'row' }}
    alignItems="center"
    justifyContent="center"
    gap={5}
    w="100%"
  >
    <ProjectCard type="previous" />
    <ProjectCard type="current" />
  </Flex>
);
