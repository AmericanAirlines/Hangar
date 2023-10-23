import { Box, Button, Flex, Heading, Tag, Text } from '@chakra-ui/react';
import { Config } from '@hangar/shared';
import { useExpoJudging } from '../hooks/useExpoJudging';
import { colors } from '../../../theme';

type ProjectCardProps = {
  type: 'Current' | 'Previous';
};

export const ProjectCard: React.FC<ProjectCardProps> = ({ type }) => {
  const { currentProject, previousProject, vote, skip, continueToNext } = useExpoJudging();

  const isPreviousProject = type === 'Previous';
  const isCurrentProject = type === 'Current';
  const isFirstProject = isCurrentProject && !previousProject;

  const project = isCurrentProject ? currentProject : previousProject;

  if (!project) return null;

  return (
    <Flex direction="column" justifyContent="space-between" gap={10} position="relative" flex={1}>
      <Flex position="absolute" w="full" top={-3} left={0} justifyContent="center">
        <Tag>{`${type} Project`}</Tag>
      </Flex>
      <Box rounded="xl" p={5} bgColor={colors.brandPrimaryDark} boxShadow="2xl">
        <Flex direction="column" justifyContent="center" gap={3}>
          <Heading>{project.name}</Heading>
          <Text>{project.description}</Text>
          {project.location ? (
            <Text color={colors.muted}>
              {Config.project.locationLabel}: {project.location}
            </Text>
          ) : null}
        </Flex>
      </Box>

      <Flex direction="column" w="full" gap={5} minHeight="100px">
        {!isFirstProject || isPreviousProject ? (
          <Button onClick={() => vote({ currentProjectChosen: isCurrentProject })}>
            Vote for Project
          </Button>
        ) : (
          <Button onClick={() => continueToNext()}>Continue</Button>
        )}
        {isCurrentProject && (
          <Button variant="ghost" onClick={() => skip()}>
            Skip Project
          </Button>
        )}
      </Flex>
    </Flex>
  );
};
