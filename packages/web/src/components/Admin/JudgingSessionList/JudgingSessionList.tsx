import React from 'react';
import { Box, Center, Flex, Heading, Spacer, Text } from '@chakra-ui/react';
import { useExpoJudgingSessionStore } from '../../../stores/expoJudgingSession';
import { colors } from '../../../theme';
import { JudgingSessionActionsMenu } from './JudgingSessionActionsMenu';
import { JudgingSessionListItemSkeleton } from './JudgingSessionListItemSkeleton';
import { useCriteriaJudgingSessionStore } from '../../../stores/criteriaJudgingSession';
import { JudgingSessionOptionsButton } from './JudgingSessionsOptionsButton';

type JudgingSessionListProps = {};

export const JudgingSessionList: React.FC<JudgingSessionListProps> = () => {
  const { doneLoading: expoJudgingSessionsLoaded, expoJudgingSessions } =
    useExpoJudgingSessionStore();
  const { doneLoading: criteriaJudgingSessionsLoaded, criteriaJudgingSessions } =
    useCriteriaJudgingSessionStore();

  React.useEffect(() => {
    void useExpoJudgingSessionStore.getState().fetchExpoJudgingSessions();
    void useCriteriaJudgingSessionStore.getState().fetchCriteriaJudgingSessions();
  }, []);

  const skeletons = React.useMemo(() => {
    const numSkeletons = 3;
    const skeletonsWithKeys: JSX.Element[] = [];
    for (let i = 0; i < numSkeletons; i += 1) {
      skeletonsWithKeys.push(<JudgingSessionListItemSkeleton key={`esj-skeleton-${i}`} />);
    }
    return skeletonsWithKeys;
  }, []);

  const noSessions = (
    <Center w="full" p={5}>
      <Text>No Judging Sessions</Text>
    </Center>
  );

  const doneLoading = expoJudgingSessionsLoaded && criteriaJudgingSessionsLoaded;
  const emptyState = doneLoading ? noSessions : skeletons;

  return (
    <Box rounded="2xl" bgColor={colors.brandPrimaryDark} boxShadow="2xl" p={5}>
      <Flex direction="column" gap={5}>
        <Flex alignItems="left" w="full" justifyContent="space-between" gap={3}>
          <Heading>Judging Sessions</Heading>
          <JudgingSessionOptionsButton />
        </Flex>

        <Heading size={{ base: 'lg' }}>Expo Judging Sessions</Heading>
        <Flex direction="column" gap={10} alignItems="space-between" justifyContent="center">
          {expoJudgingSessions?.length
            ? expoJudgingSessions?.map((session) => (
                <Box key={`ejs-${session.id}`}>
                  <Flex w="full" alignItems="center" justifyContent="space-between">
                    <Heading size="md">Session {session.id}</Heading>
                    <JudgingSessionActionsMenu judgingSession={session} />
                  </Flex>
                </Box>
              ))
            : emptyState}
        </Flex>

        <Spacer />

        <Heading size={{ base: 'lg' }}>Criteria Judging Sessions</Heading>
        <Flex direction="column" gap={10} alignItems="space-between" justifyContent="center">
          {criteriaJudgingSessions?.length
            ? criteriaJudgingSessions?.map((session) => (
                <Box key={`cjs-${session.id}`}>
                  <Flex w="full" alignItems="center" justifyContent="space-between">
                    <Heading size="md">{session.title}</Heading>
                    <JudgingSessionActionsMenu judgingSession={session} />
                  </Flex>
                </Box>
              ))
            : emptyState}
        </Flex>
      </Flex>
    </Box>
  );
};
