import React from 'react';
import { Box, Center, Flex, Heading, Text } from '@chakra-ui/react';
import { useExpoJudgingSessionStore } from '../../../stores/expoJudgingSession';
import { colors } from '../../../theme';
import { AddExpoJudgingSession } from '../../AddExpoJudgingSessionButton';
import { ExpoJudgingSessionActionsMenu } from './ExpoJudgingSessionActionsMenu';
import { ExpoJudgingSessionListItemSkeleton } from './ExpoJudgingSessionListItemSkeleton';

type ExpoJudgingSessionListProps = {};

export const ExpoJudgingSessionList: React.FC<ExpoJudgingSessionListProps> = () => {
  const { doneLoading, expoJudgingSessions } = useExpoJudgingSessionStore();

  React.useEffect(() => {
    void useExpoJudgingSessionStore.getState().fetchExpoJudgingSessions();
  }, []);

  const skeletons = new Array(4).fill(<ExpoJudgingSessionListItemSkeleton />);
  const noSessions = (
    <Center w="full" p={5}>
      <Text>No Expo Judging Sessions</Text>
    </Center>
  );
  const emptyState = doneLoading ? noSessions : skeletons;

  return (
    <Box rounded="2xl" bgColor={colors.brandPrimaryDark} boxShadow="2xl" p={5}>
      <Flex direction="column" gap={5}>
        <Flex
          direction={{ base: 'column', md: 'row' }}
          alignItems="left"
          w="full"
          justifyContent="space-between"
          gap={3}
        >
          <Heading>Expo Judging Sessions</Heading>
          <AddExpoJudgingSession />
        </Flex>

        <Flex direction="column" gap={10} alignItems="space-between" justifyContent="center">
          {expoJudgingSessions?.length
            ? expoJudgingSessions?.map((session) => (
                <Box key={`ejs-${session.id}`}>
                  <Flex w="full" alignItems="center" justifyContent="space-between">
                    <Heading size="md">Session {session.id}</Heading>
                    <ExpoJudgingSessionActionsMenu expoJudgingSession={session} />
                  </Flex>
                </Box>
              ))
            : emptyState}
        </Flex>
      </Flex>
    </Box>
  );
};
