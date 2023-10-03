import { Box, Button, Flex, Heading, Tag, Text } from '@chakra-ui/react';
import { useExpoJudging } from '../hooks/useExpoJudging';
import { colors } from '../../../theme';

type ProjectCardProps = {
  type: 'Current' | 'Previous';
};

export const ProjectCard: React.FC<ProjectCardProps> = ({ type }) => {
  const { currentProject, previousProject, vote, skip, continueToNext } = useExpoJudging();

  const isPreviousTeam = type === 'Previous';
  const isCurrentTeam = type === 'Current';
  const isFirstTeam = isCurrentTeam && !previousProject;

  const project = isCurrentTeam ? currentProject : previousProject;

  if (!project) return null;

  return (
    <Flex direction="column" gap={5} position="relative">
      <Flex position="absolute" w="full" top={-3} left={0} justifyContent="center">
        <Tag>{`${type} Project`}</Tag>
      </Flex>
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
      {isCurrentTeam && (
        <Button variant="ghost" onClick={() => skip()}>
          Skip Team
        </Button>
      )}
    </Flex>
  );
};
