import { Text, Flex, Heading, Button, Box } from '@chakra-ui/react';
import { Config, Project } from '@hangar/shared';
import { colors } from '../../../theme';

type ProjectDetailsProps = {
  project: Project;
};

export const ProjectDetails: React.FC<ProjectDetailsProps> = ({ project }) => (
  <Flex direction="column" w="full" gap={3}>
    <Heading>{project.name}</Heading>
    <Text whiteSpace="pre-wrap" wordBreak="break-all" w="full">
      {project.description}
    </Text>

    <Flex
      direction={{ base: 'column', sm: 'row' }}
      alignItems="center"
      justifyContent={'space-between'}
    >
      {project.location && (
        <Text color={colors.muted}>
          {Config.project.locationLabel}: {project.location}
        </Text>
      )}

      <Box>
        <Button
          onClick={() => {
            window.open(project.repoUrl, '_blank');
          }}
        >
          View Repo
        </Button>
      </Box>
    </Flex>
  </Flex>
);
