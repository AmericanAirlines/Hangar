import { Box, Flex } from '@chakra-ui/react';
import { useExpoJudging } from '../hooks/useExpoJudging';

type ProjectCardProps = {
  type: 'current' | 'previous';
};

export const ProjectCard: React.FC<ProjectCardProps> = ({ type }) => {
  const { currentProject, previousProject } = useExpoJudging();

  const project = type === 'current' ? currentProject : previousProject;

  if (!project) return null;

  return (
    <Flex direction="column">
      <Box rounded="xl" p={5}></Box>;
    </Flex>
  );
};
