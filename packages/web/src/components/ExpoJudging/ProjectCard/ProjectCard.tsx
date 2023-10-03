import { Box, Button, Flex, Heading, Text } from '@chakra-ui/react';
import { useExpoJudging } from '../hooks/useExpoJudging';
import { colors } from '../../../theme';

type ProjectCardProps = {
  type: 'current' | 'previous';
};

export const ProjectCard: React.FC<ProjectCardProps> = ({ type }) => {
  const { currentProject, previousProject, vote, skip, continueToNext } = useExpoJudging();

  const isPreviousTeam = type === 'previous';
  const isCurrentTeam = type === 'current';
  const isFirstTeam = isCurrentTeam && !previousProject;

  const project = isCurrentTeam ? currentProject : previousProject;

  if (!project) return null;

  return (
    <Flex direction="column">
      <Box rounded="xl" p={5} bgColor={colors.brandPrimaryDark} boxShadow="2xl">
        <Flex direction="column" justifyContent="center">
          <Heading>{project.name}</Heading>
          <Text>{project.description}</Text>
          <Text color={colors.muted}>{project.location}</Text>
        </Flex>
      </Box>

      {!isFirstTeam || isPreviousTeam ? (
        <Button onClick={() => vote({ currentTeamChosen: isCurrentTeam })}>Vote for Team</Button>
      ) : (
        <Button onClick={() => continueToNext()}>Continue</Button>
      )}
      <Button variant="ghost" onClick={() => skip()}>
        Skip Team
      </Button>
    </Flex>
  );
};
