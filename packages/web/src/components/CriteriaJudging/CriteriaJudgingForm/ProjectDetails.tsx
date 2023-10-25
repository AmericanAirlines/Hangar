import { Text, Flex, Heading } from '@chakra-ui/react';
import { Config, Project } from '@hangar/shared';
import { colors } from '../../../theme';

type ProjectDetailsProps = {
  project: Project;
};

export const ProjectDetails: React.FC<ProjectDetailsProps> = ({ project }) => (
  <Flex direction="column" w="full">
    <Heading>{project.name}</Heading>
    <Text whiteSpace="pre-wrap" wordBreak="break-all" w="full">
      {project.description}
    </Text>
    <Text color={colors.muted}>
      {Config.project.locationLabel}: {project.location}
    </Text>
  </Flex>
);
