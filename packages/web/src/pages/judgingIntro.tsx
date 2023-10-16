import React from "react";
import { Box, Heading, Text, Button } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { PageContainer } from '../components/layout/PageContainer';
import { useExpoJudgingSessionFetcher } from "../pageUtils/expoJudgingSession/[id]/useExpoJudgingSessionFetcher";

const JudgingIntro = () => {
  const { expoJudgingSession } = useExpoJudgingSessionFetcher();
  const router = useRouter();
  const handleStartJudging = () => {
    if (expoJudgingSession){
      void router.push(`/judging/project/${expoJudgingSession.id}`);
    }
  };
  return (
    <PageContainer
      pageTitle={'Judging'}
      heading={'Judging Introduction'}
      isLoading={!expoJudgingSession}
    >
      <Box>
        <Heading>How Judging Works</Heading>
        <Text>
          The judging process is simple! Just follow these three steps:
        </Text>
        <Text>
          1. Click the &quot;Start Judging&quot; button below to begin the judging process
        </Text>
        <Text>
          2. Rate the project based on the criteria provided
        </Text>
          3. Click the &quot;Next&quot; button to move to the next project
        <Text>
        </Text>
        <Button onClick={handleStartJudging}>Start Judging</Button>
      </Box>
    </PageContainer>
  );
};

export default JudgingIntro;