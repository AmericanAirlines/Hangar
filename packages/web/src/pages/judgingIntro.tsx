import React from 'react';
import { Box, Text, Button, Flex, List, ListItem, ListIcon, Icon } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { MdCheckCircle, MdSettings } from 'react-icons/md';
import { BsFill1SquareFill, BsFill2SquareFill, BsFill3SquareFill } from 'react-icons/bs';
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
      heading={'How Judging Works'}
      isLoading={!expoJudgingSession}
    >
      <Flex direction="column" gap={5}>
        <Box>
          <List spacing={4}>
            <ListItem fontSize={20}>
              <ListIcon as={BsFill1SquareFill} color="green.500" boxSize={6} />
              When you first begin judging, you will not have seen enough projects to compare so you
              will either
            </ListItem>
            <ListItem fontSize={20}>
              <ListIcon as={BsFill2SquareFill} color="green.500" boxSize={6} />
              When you do get 2 projects to compare, you will select which of the two is better
              based on the given criteria&quot;
            </ListItem>
            <ListItem fontSize={20}>
              <ListIcon as={BsFill3SquareFill} color="green.500" boxSize={6} />
              Once you made your first vote, find your new &quot;current&quot; team and keep voting
              until the voting session ends or you seen all the teams
            </ListItem>
          </List>
        </Box>
        <Button onClick={handleStartJudging}>Start Judging</Button>
      </Flex>
    </PageContainer>
  );
};

export default JudgingIntro;
