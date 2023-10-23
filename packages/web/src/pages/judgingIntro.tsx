import React from 'react';
import { Box, Button, Flex, List, ListItem, ListIcon } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { BsFill1CircleFill, BsFill2CircleFill, BsFill3CircleFill } from 'react-icons/bs';
import { PageContainer } from '../components/layout/PageContainer';
import { useExpoJudgingSessionFetcher } from '../pageUtils/expoJudgingSession/[id]/useExpoJudgingSessionFetcher';

const JudgingIntro = () => {
  const { expoJudgingSession } = useExpoJudgingSessionFetcher();
  const router = useRouter();
  const handleStartJudging = () => {
    if (expoJudgingSession) {
      void router.push(`/judging/project/${expoJudgingSession.id}`);
    }
  };
  return (
    <PageContainer
      pageTitle={'Judging'}
      heading={'How Expo Judging Works'}
      isLoading={!expoJudgingSession}
    >
      <Flex direction="column" gap={5}>
        <Box>
          <List spacing={4}>
            <ListItem fontSize={20}>
              <ListIcon as={BsFill1CircleFill} color="green.500" boxSize={6} />
              Locate the project you need to judge and listen to their amazing pitch.
            </ListItem>
            <ListItem fontSize={20}>
              <ListIcon as={BsFill2CircleFill} color="green.500" boxSize={6} />
              {`After you've heard the pitch, get your next project and repeat the process.`}
            </ListItem>
            <ListItem fontSize={20}>
              <ListIcon as={BsFill3CircleFill} color="green.500" boxSize={6} />
              Continue judging projects until there&apos;s no more teams to judge or until judging
              has ended.
            </ListItem>
          </List>
        </Box>
        <Button onClick={handleStartJudging}>Start Judging</Button>
      </Flex>
    </PageContainer>
  );
};

export default JudgingIntro;
