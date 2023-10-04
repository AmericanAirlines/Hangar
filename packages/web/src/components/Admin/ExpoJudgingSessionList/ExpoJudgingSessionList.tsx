import { Box, Flex, Heading } from '@chakra-ui/react';
import { useExpoJudgingSessionStore } from '../../../stores/expoJudgingSession';
import { colors } from '../../../theme';
import { AddExpoJudgingSession } from '../../AddExpoJudgingSessionButton';

type ExpoJudgingSessionListProps = {};

export const ExpoJudgingSessionList: React.FC<ExpoJudgingSessionListProps> = () => {
  const { expoJudgingSessions } = useExpoJudgingSessionStore();

  // TODO: If !doneLoading, show skeleton

  return (
    <Box>
      <Flex rounded="xl" bgColor={colors.brandPrimaryDark} boxShadow="2xl" p={5}>
        <Flex alignItems="center">
          <Heading>Expo Judging Sessions</Heading>
          <AddExpoJudgingSession />
        </Flex>
      </Flex>
    </Box>
  );
};
