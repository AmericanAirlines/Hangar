import { Box, Flex, Heading, Text } from '@chakra-ui/react';
import { useExpoJudging } from '../hooks/useExpoJudging';
import { colors } from '../../../theme';

type ProjectCardProps = {
  type: 'current' | 'previous';
};

export const ProjectCard: React.FC<ProjectCardProps> = ({ type }) => {
  const { currentProject, previousProject } = useExpoJudging();

  const project = type === 'current' ? currentProject : previousProject;

  if (!project) return null;

  return (
    <Flex direction="column">
      <Box rounded="xl" p={5} bgColor={colors.brandPrimaryDark}>
        <Flex direction="column" justifyContent="center">
          <Heading>{project.name}</Heading>
          <Text>{project.description}</Text>
          <Text color={colors.muted}>{project.location}</Text>
        </Flex>
      </Box>

      {/* Project Actions Here */}
    </Flex>
  );
};
